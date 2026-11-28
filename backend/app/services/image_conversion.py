import fitz  # PyMuPDF
import os
from pathlib import Path
from PIL import Image
import io

def compress_image_under_target(img_path: Path, output_path: Path, target_bytes: int = 500 * 1024) -> Path:
    """
    Compress an image specifically so that >1MB images are brought down to <= 500KB.
    Maintains aspect ratio and visual clarity while aggressively tuning quality/dimensions.
    """
    img = Image.open(img_path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # If already smaller than target, save standard optimized
    orig_size = img_path.stat().st_size
    if orig_size <= target_bytes:
        img.save(output_path, format="JPEG", quality=85, optimize=True)
        return output_path

    # Iterative reduction until <= target_bytes
    qualities = [80, 68, 55, 45, 35]
    max_dims = [2000, 1600, 1200, 1000, 800]

    for max_d, q in zip(max_dims, qualities):
        work_img = img.copy()
        if work_img.width > max_d or work_img.height > max_d:
            work_img.thumbnail((max_d, max_d), Image.Resampling.LANCZOS)
        
        buf = io.BytesIO()
        work_img.save(buf, format="JPEG", quality=q, optimize=True)
        data = buf.getvalue()
        
        if len(data) <= target_bytes or (max_d == max_dims[-1] and q == qualities[-1]):
            with open(output_path, "wb") as f:
                f.write(data)
            break

    return output_path

def convert_images_to_pdf(image_paths: list[Path], output_pdf_path: Path) -> Path:
    """Convert one or multiple image files into a single multi-page PDF."""
    doc = fitz.open()
    for img_path in image_paths:
        img = Image.open(img_path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Optimize image memory footprint
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="JPEG", quality=85, optimize=True)
        img_bytes = img_buffer.getvalue()
        
        # Create PDF page with exact image dimensions
        img_doc = fitz.open("pdf", fitz.open(stream=img_bytes, filetype="jpeg").convert_to_pdf())
        doc.insert_pdf(img_doc)
        img_doc.close()

    doc.save(output_pdf_path, garbage=3, deflate=True)
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
        
        # Save through Pillow to apply compression
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        if format.lower() in ("jpg", "jpeg"):
            if img.mode != "RGB":
                img = img.convert("RGB")
            img.save(out_path, format="JPEG", quality=80, optimize=True)
        else:
            img.save(out_path, format=format.upper(), optimize=True)
            
        output_files.append(out_path)
        
    doc.close()
    return output_files
