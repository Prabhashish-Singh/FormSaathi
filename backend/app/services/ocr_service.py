
import os
import pymupdf
import pytesseract
import re
import shutil
import logging

from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

load_dotenv()
logger = logging.getLogger(__name__)

# Connect Python to the installed Tesseract application
pytesseract.pytesseract.tesseract_cmd = (
    os.getenv("TESSERACT_CMD")
    or shutil.which("tesseract")
    or r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# Supported OCR languages
SUPPORTED_LANGUAGES = {
    "English": "eng",
    "Hindi": "hin",
    "Punjabi": "pan",
    "Bengali": "ben",
    "Gujarati": "guj",
    "Marathi": "mar",
    "Tamil": "tam",
    "Telugu": "tel",
    "Kannada": "kan",
    "Malayalam": "mal",
    "Odia": "ori",
    "Urdu": "urd",
    "Auto Detect": "auto"
}

SCRIPT_TO_LANGUAGE = {
    "Latin": "English",
    "Devanagari": "Hindi",
    "Gurmukhi": "Punjabi",
    "Bengali": "Bengali",
    "Gujarati": "Gujarati",
    "Tamil": "Tamil",
    "Telugu": "Telugu",
    "Kannada": "Kannada",
    "Malayalam": "Malayalam",
    "Oriya": "Odia",
    "Arabic": "Urdu"
}

def detect_ocr_language(image):
    try:
        osd_result = pytesseract.image_to_osd(
            image,
            config="--psm 0"
        )

        logger.debug("Tesseract detected script: %s", osd_result)

        script_match = re.search(
            r"Script:\s*(.+)",
            osd_result
        )

        if script_match:
            detected_script = script_match.group(1).strip()
            return SCRIPT_TO_LANGUAGE.get(detected_script, "English")

    except Exception:
        logger.debug("Tesseract script detection failed", exc_info=True)

    return "English"

def extract_text(file_bytes, filename, language="English"):

    lang_code = SUPPORTED_LANGUAGES.get(language, "eng")
    extracted_text = ""

    # Handle PDF files
    if filename.lower().endswith(".pdf"):

        pdf = pymupdf.open(
            stream=file_bytes,
            filetype="pdf"
        )

        for page_number, page in enumerate(pdf):

            # First try extracting digital PDF text
            page_text = page.get_text().strip()

            if len(page_text) > 30:
                extracted_text += page_text + "\n"

            else:
                # If scanned, convert page to image
                pix = page.get_pixmap(
                    matrix=pymupdf.Matrix(2, 2)
                )

                image = Image.open(
                    BytesIO(pix.tobytes("png"))
                )

                # Perform OCR
                if language == "Auto Detect":
                    detected_language = detect_ocr_language(image)
                    lang_code = SUPPORTED_LANGUAGES.get(detected_language, "eng")

                page_text = pytesseract.image_to_string(image, lang=lang_code)

                extracted_text += page_text + "\n"

        pdf.close()

    # Handle image files
    else:
        image = Image.open(BytesIO(file_bytes))

        if language == "Auto Detect":
            detected_language = detect_ocr_language(image)
            lang_code = SUPPORTED_LANGUAGES.get(detected_language, "eng")

        extracted_text = pytesseract.image_to_string(
            image,
            lang=lang_code
    )

    return extracted_text.strip()
