from langdetect import detect, LangDetectException

SUPPORTED_LANGUAGES = {
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
    "ur": "Urdu"
}


def detect_document_language(text: str):

    if not text or len(text.strip()) < 30:
        return {
            "language": None,
            "language_code": None,
            "status": "insufficient_text"
        }

    try:
        detected_code = detect(text)

        language_name = SUPPORTED_LANGUAGES.get(
            detected_code
        )

        if not language_name:
            return {
                "language": None,
                "language_code": detected_code,
                "status": "unsupported_language"
            }

        return {
            "language": language_name,
            "language_code": detected_code,
            "status": "success"
        }

    except LangDetectException:
        return {
            "language": None,
            "language_code": None,
            "status": "detection_failed"
        }