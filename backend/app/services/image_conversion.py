import fitz  # PyMuPDF
import os
from pathlib import Path
from PIL import Image
import io

def convert_images_to_pdf(image_paths: list[Path], output_pdf_path: Path) -> Path:
    """Convert one or multiple image files into a single multi-page PDF."""
    doc = fitz.open()
    for img_path in image_paths:
        # Load image via PyMuPDF or Pillow
        img = Image.open(img_path)
        # Convert RGBA to RGB for standard PDF compliance
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Save to memory buffer
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="JPEG", quality=95)
        img_bytes = img_buffer.getvalue()
        
        # Create PDF page with exact image dimensions
        img_doc = fitz.open("pdf", fitz.open(stream=img_bytes, filetype="jpeg").convert_to_pdf())
        doc.insert_pdf(img_doc)
        img_doc.close()

    doc.save(output_pdf_path)
    doc.close()
    return output_pdf_path

def convert_pdf_to_images(pdf_path: Path, output_dir: Path, dpi: int = 150, format: str = "jpg") -> list[Path]:
    """Convert each page of a PDF into high quality JPG/PNG images."""
    doc = fitz.open(pdf_path)
    output_files = []
    
    matrix = fitz.Matrix(dpi / 72, dpi / 72)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        out_filename = f"page_{i + 1}.{format}"
        out_path = output_dir / out_filename
        pix.save(str(out_path))
        output_files.append(out_path)
        
    doc.close()
    return output_files
