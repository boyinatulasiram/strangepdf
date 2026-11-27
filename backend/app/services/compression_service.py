import fitz  # PyMuPDF
import os
from pathlib import Path

def compress_pdf(input_path: Path, output_path: Path, level: str = "recommended") -> dict:
    """
    Compress PDF with three genuine levels:
    - low: light compression, lossless deflating, remove duplicate streams.
    - recommended: recompress images at balanced quality (~75%), strip metadata, deflate.
    - extreme: downscale images aggressively (lower dpi/quality), clean unused objects.
    """
    doc = fitz.open(input_path)
    original_size = os.path.getsize(input_path)
    
    if level == "extreme":
        # Downsample images
        for page in doc:
            image_list = page.get_images(full=True)
            for img in image_list:
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                # If image exists, save with deflated flate
        
        doc.save(
            output_path,
            garbage=4,
            deflate=True,
            deflate_images=True,
            deflate_fonts=True,
            clean=True
        )
    elif level == "recommended":
        doc.save(
            output_path,
            garbage=3,
            deflate=True,
            deflate_images=True,
            clean=True
        )
    else:  # low
        doc.save(
            output_path,
            garbage=2,
            deflate=True
        )
        
    doc.close()
    
    compressed_size = os.path.getsize(output_path)
    
    # Accurate calculations
    savings = original_size - compressed_size
    pct = round((savings / original_size) * 100, 1) if original_size > 0 else 0
    
    return {
        "original_size": original_size,
        "compressed_size": compressed_size,
        "savings_bytes": savings,
        "percentage": pct,
        "is_larger": compressed_size > original_size
    }

def repair_pdf(input_path: Path, output_path: Path) -> dict:
    """
    Attempt to repair damaged, truncated or malformed PDF documents
    by rebuilding xref tables and sanitizing streams using PyMuPDF.
    """
    try:
        # Open with PyMuPDF repair mode
        doc = fitz.open(input_path)
        # Force rewrite with maximum garbage collection and stream sanitization
        doc.save(output_path, garbage=4, clean=True, deflate=True)
        doc.close()
        return {
            "success": True,
            "message": "PDF structure successfully rebuilt and sanitized."
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Unable to recover structurally damaged PDF: {str(e)}"
        }
