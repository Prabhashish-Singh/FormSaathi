import os
import logging
import uuid
from pathlib import PurePath

import pymupdf
import pytesseract
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.schemas.qa import QuestionRequest
from app.services.ai_service import analyze_document, answer_document_question, extract_important_information
from app.services.language_service import detect_document_language
from app.services.ocr_service import extract_text
from app.services.supabase_service import get_admin_supabase, get_authenticated_user


router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_PDF_PAGES = 20
ALLOWED_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
}
OUTPUT_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "pa": "Punjabi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "or": "Odia",
    "ur": "Urdu",
}
OCR_LANGUAGES = {
    "Auto Detect",
    "English",
    "Hindi",
    "Punjabi",
    "Bengali",
    "Gujarati",
    "Marathi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Odia",
    "Urdu",
}


def language_name(code: str) -> str:
    return OUTPUT_LANGUAGES.get(code, code)


@router.get("/auth/me")
async def auth_me(user: dict = Depends(get_authenticated_user)):
    metadata = user.get("user_metadata") or {}
    return {
        "id": user["id"],
        "email": user.get("email"),
        "name": metadata.get("full_name") or metadata.get("name"),
    }


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    explanation_language: str = Form("en"),
    explanation_level: str = Form("Simple"),
    category: str = Form("Auto Detect"),
    ocr_language: str = Form("Auto Detect"),
    user: dict = Depends(get_authenticated_user),
):
    if explanation_language not in OUTPUT_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported explanation language.")
    if explanation_level not in {"Simple", "Detailed", "Very Simple"}:
        raise HTTPException(status_code=400, detail="Unsupported explanation level.")
    if ocr_language not in OCR_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported OCR language.")

    safe_name = PurePath(file.filename or "").name
    if not safe_name or safe_name in {".", ".."}:
        raise HTTPException(status_code=400, detail="Please upload a file with a valid filename.")
    extension = os.path.splitext(safe_name)[1].lower()
    if extension not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF, JPG, JPEG and PNG files are allowed.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size must not exceed 10 MB.")

    actual_type = ALLOWED_TYPES[extension]
    if extension == ".pdf" and not contents.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File content does not match its PDF extension.")
    if extension == ".png" and not contents.startswith(b"\x89PNG\r\n\x1a\n"):
        raise HTTPException(status_code=400, detail="File content does not match its PNG extension.")
    if extension in {".jpg", ".jpeg"} and not contents.startswith(b"\xff\xd8\xff"):
        raise HTTPException(status_code=400, detail="File content does not match its JPEG extension.")

    if extension == ".pdf":
        try:
            pdf = pymupdf.open(stream=contents, filetype="pdf")
            page_count = pdf.page_count
            pdf.close()
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid or damaged PDF file.") from exc
        if page_count > MAX_PDF_PAGES:
            raise HTTPException(status_code=413, detail=f"PDF cannot contain more than {MAX_PDF_PAGES} pages.")

    user_id = user["id"]
    document_id = str(uuid.uuid4())
    storage_path = f"{user_id}/{document_id}{extension}"
    admin = get_admin_supabase()

    try:
        admin.storage.from_("formsaathi-documents").upload(
            storage_path,
            contents,
            {"content-type": actual_type, "upsert": "false"},
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Document upload to private storage failed.") from exc

    document_insert = {
        "id": document_id,
        "user_id": user_id,
        "original_filename": safe_name,
        "storage_path": storage_path,
        "file_type": extension,
        "file_size": len(contents),
        "document_category": category,
        "explanation_language": explanation_language,
        "processing_status": "processing",
    }
    try:
        admin.table("documents").insert(document_insert).execute()
    except Exception as exc:
        try:
            admin.storage.from_("formsaathi-documents").remove([storage_path])
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Could not create the document record.") from exc

    try:
        extracted_text = extract_text(contents, safe_name, language=ocr_language)
        if not extracted_text.strip():
            raise ValueError("No readable text could be extracted.")
        analysis = analyze_document(
            extracted_text,
            output_language=language_name(explanation_language),
            explanation_level=explanation_level,
            category=category,
        )
        model_name = os.getenv("GEMINI_MODEL") or "gemini-3.5-flash-lite"
        admin.table("document_analyses").insert({
            "document_id": document_id,
            "user_id": user_id,
            "document_title": analysis["document_title"],
            "summary": analysis["summary"],
            "simplified_explanation": analysis["simplified_explanation"],
            "eligibility": analysis["eligibility"],
            "important_dates": analysis["important_dates"],
            "financial_information": analysis["financial_information"],
            "required_documents": analysis["required_documents"],
            "application_procedure": analysis["application_procedure"],
            "conditions": analysis["conditions"],
            "action_checklist": analysis["action_checklist"],
            "key_takeaways": analysis["key_takeaways"],
            "ai_model": model_name,
        }).execute()
        admin.table("documents").update({
            "extracted_text": extracted_text,
            "document_category": analysis["document_category"] or category,
            "original_language": analysis["original_language"],
            "processing_status": "completed",
            "error_message": None,
        }).eq("id", document_id).eq("user_id", user_id).execute()
    except (pytesseract.TesseractNotFoundError, pytesseract.TesseractError) as exc:
        logger.exception("OCR failed while processing document %s", document_id)
        try:
            admin.table("documents").update({
                "processing_status": "failed",
                "error_message": "Tesseract OCR could not process this document.",
            }).eq("id", document_id).eq("user_id", user_id).execute()
        except Exception:
            logger.exception("Could not save the OCR failure status for document %s", document_id)
        raise HTTPException(status_code=503, detail="Tesseract OCR is not available or could not process the document.") from exc
    except Exception as exc:
        logger.exception("Document processing failed for document %s", document_id)
        try:
            admin.table("documents").update({
                "processing_status": "failed",
                "error_message": "Document processing or Gemini analysis failed.",
            }).eq("id", document_id).eq("user_id", user_id).execute()
        except Exception:
            logger.exception("Could not save the processing failure status for document %s", document_id)
        raise HTTPException(status_code=503, detail="AI document analysis is temporarily unavailable. No fabricated result was returned.") from exc

    return get_document_record(document_id, user_id)


def get_owned_document(admin, document_id: str, user_id: str):
    result = admin.table("documents").select("*").eq("id", document_id).eq("user_id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Document not found.")
    return result.data[0]


def get_document_record(document_id: str, user_id: str):
    admin = get_admin_supabase()
    document = get_owned_document(admin, document_id, user_id)
    analysis_result = admin.table("document_analyses").select("*").eq("document_id", document_id).eq("user_id", user_id).limit(1).execute()
    document["analysis"] = analysis_result.data[0] if analysis_result.data else None
    return document


@router.get("/documents")
async def list_documents(user: dict = Depends(get_authenticated_user)):
    admin = get_admin_supabase()
    result = admin.table("documents").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
    return result.data


@router.get("/documents/{document_id}")
async def get_document(document_id: str, user: dict = Depends(get_authenticated_user)):
    return get_document_record(document_id, user["id"])


@router.get("/documents/{document_id}/analysis")
async def get_analysis(document_id: str, user: dict = Depends(get_authenticated_user)):
    admin = get_admin_supabase()
    get_owned_document(admin, document_id, user["id"])
    result = admin.table("document_analyses").select("*").eq("document_id", document_id).eq("user_id", user["id"]).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return result.data[0]


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str, user: dict = Depends(get_authenticated_user)):
    admin = get_admin_supabase()
    document = get_owned_document(admin, document_id, user["id"])
    try:
        admin.storage.from_("formsaathi-documents").remove([document["storage_path"]])
    except Exception as exc:
        logger.exception("Could not remove stored file for document %s", document_id)
        raise HTTPException(status_code=500, detail="Could not delete the stored document. Try again.") from exc
    conversation_result = admin.table("conversations").select("id").eq("document_id", document_id).eq("user_id", user["id"]).limit(1).execute()
    if conversation_result.data:
        conversation_id = conversation_result.data[0]["id"]
        admin.table("chat_messages").delete().eq("conversation_id", conversation_id).execute()
        admin.table("conversations").delete().eq("id", conversation_id).eq("user_id", user["id"]).execute()
    admin.table("document_analyses").delete().eq("document_id", document_id).eq("user_id", user["id"]).execute()
    admin.table("documents").delete().eq("id", document_id).eq("user_id", user["id"]).execute()
    return {"deleted": True, "id": document_id}


@router.post("/documents/{document_id}/ask")
async def ask_document(document_id: str, request: QuestionRequest, user: dict = Depends(get_authenticated_user)):
    admin = get_admin_supabase()
    document = get_owned_document(admin, document_id, user["id"])
    extracted_text = document.get("extracted_text") or ""
    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No extracted document text is available.")
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    conversation_result = admin.table("conversations").select("id").eq("document_id", document_id).eq("user_id", user["id"]).limit(1).execute()
    if conversation_result.data:
        conversation_id = conversation_result.data[0]["id"]
    else:
        created = admin.table("conversations").insert({
            "user_id": user["id"],
            "document_id": document_id,
        }).execute()
        conversation_id = created.data[0]["id"]

    history_result = admin.table("chat_messages").select("role,message").eq("conversation_id", conversation_id).order("created_at", desc=False).limit(20).execute()
    history = [{"role": item["role"], "content": item["message"]} for item in history_result.data]

    admin.table("chat_messages").insert({
        "conversation_id": conversation_id,
        "role": "user",
        "message": request.question,
    }).execute()

    try:
        answer = answer_document_question(
            document_text=extracted_text,
            question=request.question,
            output_language=language_name(request.output_language),
            conversation_history=history,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Unable to answer the document question right now.") from exc

    admin.table("chat_messages").insert({
        "conversation_id": conversation_id,
        "role": "assistant",
        "message": answer,
    }).execute()
    return {"question": request.question, "answer": answer, "conversation_id": conversation_id}


@router.delete("/documents/{document_id}/conversation")
async def clear_document_conversation(document_id: str, user: dict = Depends(get_authenticated_user)):
    admin = get_admin_supabase()
    get_owned_document(admin, document_id, user["id"])
    conversation_result = admin.table("conversations").select("id").eq("document_id", document_id).eq("user_id", user["id"]).limit(1).execute()
    if not conversation_result.data:
        return {"cleared": True, "document_id": document_id}

    conversation_id = conversation_result.data[0]["id"]
    admin.table("chat_messages").delete().eq("conversation_id", conversation_id).execute()
    admin.table("conversations").delete().eq("id", conversation_id).eq("user_id", user["id"]).execute()
    return {"cleared": True, "document_id": document_id}


@router.post("/upload")
async def upload_document_standalone(
    file: UploadFile = File(...),
    language: str = Form("Auto Detect"),
    output_language: str = Form("English"),
    user: dict = Depends(get_authenticated_user),
):
    """Authenticated compatibility endpoint for the standard upload payload."""
    if language not in OCR_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported OCR language.")
    if output_language not in set(OUTPUT_LANGUAGES.values()):
        raise HTTPException(status_code=400, detail="Unsupported explanation language.")
    safe_name = PurePath(file.filename or "").name
    if not safe_name or safe_name in {".", ".."}:
        raise HTTPException(status_code=400, detail="Please upload a file with a valid filename.")
    extension = os.path.splitext(safe_name)[1].lower()
    if extension not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF, JPG, JPEG and PNG files are allowed.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size must not exceed 10 MB.")

    if extension == ".pdf":
        try:
            pdf = pymupdf.open(stream=contents, filetype="pdf")
            page_count = pdf.page_count
            pdf.close()
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid or damaged PDF file.") from exc
        if page_count > MAX_PDF_PAGES:
            raise HTTPException(status_code=413, detail=f"PDF cannot contain more than {MAX_PDF_PAGES} pages.")

    try:
        extracted_text = extract_text(contents, safe_name, language=language)
        if not extracted_text.strip():
            raise ValueError("No readable text could be extracted from this document.")

        detected = detect_document_language(extracted_text)
        detected_language = detected.get("language") or "English"

        # AI analysis for simplified explanation
        analysis = analyze_document(
            extracted_text,
            output_language=output_language,
            explanation_level="Simple",
            category="Auto Detect",
        )

        # AI extraction for structured important information
        try:
            important_info = extract_important_information(
                extracted_text,
                output_language=output_language,
            )
        except Exception:
            important_info = {
                "document_type": analysis.get("document_title", ""),
                "summary": analysis.get("summary", ""),
                "important_dates": analysis.get("important_dates", []),
                "deadlines": [],
                "amounts": analysis.get("financial_information", []),
                "required_documents": analysis.get("required_documents", []),
                "eligibility_conditions": analysis.get("eligibility", []),
                "important_conditions": analysis.get("conditions", []),
                "missing_information": [],
                "action_checklist": analysis.get("action_checklist", []),
            }

        return {
            "message": "Document processed successfully",
            "filename": safe_name,
            "file_type": extension,
            "size_bytes": len(contents),
            "extracted_text": extracted_text,
            "detected_language": detected_language,
            "ai_analysis": analysis.get("simplified_explanation", ""),
            "important_information": important_info,
            "status": "success",
        }
    except (pytesseract.TesseractNotFoundError, pytesseract.TesseractError) as exc:
        logger.exception("OCR failed for document %s", safe_name)
        raise HTTPException(status_code=503, detail="Tesseract OCR is not available or could not process the document.") from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Processing failed for document %s", safe_name)
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(exc)}") from exc


@router.post("/ask")
async def ask_document_standalone(
    request: QuestionRequest,
    user: dict = Depends(get_authenticated_user),
):
    """Authenticated compatibility endpoint for document Q&A."""
    if not request.document_text.strip():
        raise HTTPException(status_code=400, detail="No extracted document text is available.")
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        answer = answer_document_question(
            document_text=request.document_text,
            question=request.question,
            output_language=request.output_language,
            conversation_history=request.conversation_history,
        )
        return {
            "question": request.question,
            "answer": answer,
            "status": "success",
        }
    except Exception as exc:
        logger.exception("Answering document question failed")
        raise HTTPException(status_code=503, detail="Unable to answer the document question right now.") from exc
