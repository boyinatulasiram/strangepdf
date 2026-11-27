import fitz  # PyMuPDF
from pathlib import Path
from PIL import Image
import io

try:
    import pytesseract
except ImportError:
    pytesseract = None

def perform_ocr(pdf_path: Path, output_txt_path: Path, output_searchable_pdf_path: Path = None, lang: str = "eng") -> dict:
    """
    Extract text and/or create OCR layer from scanned PDFs using PyMuPDF and Tesseract.
    Falls back gracefully to direct text extraction if OCR engine is unavailable.
    """
    doc = fitz.open(pdf_path)
    extracted_text = []
    
    has_tesseract = False
    if pytesseract:
        try:
            # Quick check if tesseract binary is runnable
            pytesseract.get_tesseract_version()
            has_tesseract = True
        except Exception:
            has_tesseract = False

    for page_idx, page in enumerate(doc):
        # 1. First try native text
        page_text = page.get_text("text").strip()
        
        # 2. If page has no native text and tesseract is available, OCR images
        if not page_text and has_tesseract:
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            try:
                ocr_result = pytesseract.image_to_string(img, lang=lang)
                page_text = ocr_result.strip()
            except Exception as e:
                page_text = f"[OCR processing error on page {page_idx + 1}: {e}]"
                
        extracted_text.append(f"--- PAGE {page_idx + 1} ---\n" + (page_text if page_text else "[Scanned/Image page - no text detected]"))
        
    full_text = "\n\n".join(extracted_text)
    
    with open(output_txt_path, "w", encoding="utf-8") as f:
        f.write(full_text)
        
    doc.close()
    
    return {
        "text_file": str(output_txt_path),
        "total_pages": len(extracted_text),
        "char_count": len(full_text),
        "tesseract_available": has_tesseract
    }
