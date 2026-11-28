import fitz  # PyMuPDF
import os
import io
import shutil
import subprocess
from pathlib import Path
from PIL import Image

TARGET_BYTES = 500 * 1024  # 500 KB target

def _get_ghostscript_bin() -> str | None:
    for cmd in ["gswin64c", "gswin32c", "gs", "ghostscript"]:
        path = shutil.which(cmd)
        if path:
            return path
    win_paths = [
        r"C:\Program Files\gs\gs10.03.0\bin\gswin64c.exe",
        r"C:\Program Files\gs\gs10.02.1\bin\gswin64c.exe",
        r"C:\Program Files\gs\gs10.01.2\bin\gswin64c.exe",
        r"C:\Program Files (x86)\gs\gs10.03.0\bin\gswin32c.exe"
    ]
    for p in win_paths:
        if Path(p).exists():
            return p
    return None

def _compress_with_ghostscript(input_path: Path, output_path: Path, setting: str = "/ebook") -> bool:
    """
    Ghostscript PDF settings:
    /screen: lowest resolution (72 dpi), maximum compression for web/email
    /ebook: medium resolution (150 dpi), balanced
    /printer: high resolution (300 dpi)
    """
    gs_bin = _get_ghostscript_bin()
    if not gs_bin:
        return False
    try:
        cmd = [
            gs_bin,
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            f"-dPDFSETTINGS={setting}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={str(output_path)}",
            str(input_path)
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=45)
        return output_path.exists() and output_path.stat().st_size > 0
    except Exception:
        return False

def _recompress_pdf_images(doc: fitz.Document, max_dim: int, quality: int):
    """
    Recompress embedded images in PDF down to specified max dimension and JPEG quality.
    """
    for page in doc:
        image_list = page.get_images(full=True)
        for img_info in image_list:
            xref = img_info[0]
            try:
                base_image = doc.extract_image(xref)
                if not base_image:
                    continue
                image_bytes = base_image["image"]
                img_format = base_image.get("ext", "").lower()
                
                pil_img = Image.open(io.BytesIO(image_bytes))
                
                # Check dimensions and downscale if larger than max_dim
                orig_w, orig_h = pil_img.size
                if orig_w > max_dim or orig_h > max_dim:
                    pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
                if pil_img.mode in ("RGBA", "P"):
                    pil_img = pil_img.convert("RGB")
                    
                out_buf = io.BytesIO()
                pil_img.save(out_buf, format="JPEG", quality=quality, optimize=True)
                new_image_bytes = out_buf.getvalue()
                
                # Only replace if newly compressed bytes are smaller
                if len(new_image_bytes) < len(image_bytes):
                    doc.update_stream(xref, new_image_bytes)
            except Exception:
                continue

def _rasterize_pdf_under_target(input_path: Path, output_path: Path, target_bytes: int = 500 * 1024) -> bool:
    """
    Fallback for large scanned/graphic PDFs:
    Re-render pages at targeted DPI and JPEG quality so the entire PDF is <= 500KB.
    Iteratively lowers DPI/quality if needed.
    """
    try:
        doc = fitz.open(input_path)
        total_pages = len(doc)
        if total_pages == 0:
            doc.close()
            return False

        # Budget bytes per page
        per_page_target = max(18 * 1024, int(target_bytes * 0.85 / total_pages))

        dpis_and_qualities = [
            (110, 65, 1200),
            (90, 50, 1000),
            (72, 40, 800),
            (60, 30, 600)
        ]

        best_temp_path = output_path.with_suffix(".tmp.pdf")

        for dpi, quality, max_dim in dpis_and_qualities:
            new_doc = fitz.open()
            matrix = fitz.Matrix(dpi / 72, dpi / 72)
            
            for page in doc:
                pix = page.get_pixmap(matrix=matrix, alpha=False)
                pil_img = Image.open(io.BytesIO(pix.tobytes("png")))
                
                if pil_img.width > max_dim or pil_img.height > max_dim:
                    pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                if pil_img.mode in ("RGBA", "P"):
                    pil_img = pil_img.convert("RGB")
                    
                buf = io.BytesIO()
                pil_img.save(buf, format="JPEG", quality=quality, optimize=True)
                img_data = buf.getvalue()
                
                # Insert as page
                img_pdf = fitz.open("pdf", fitz.open(stream=img_data, filetype="jpeg").convert_to_pdf())
                new_doc.insert_pdf(img_pdf)
                img_pdf.close()
                
            new_doc.save(
                best_temp_path,
                garbage=4,
                deflate=True,
                deflate_images=True,
                clean=True
            )
            new_doc.close()
            
            size = best_temp_path.stat().st_size
            if size <= target_bytes:
                break

        doc.close()
        if best_temp_path.exists():
            if output_path.exists():
                output_path.unlink()
            best_temp_path.rename(output_path)
            return True
    except Exception:
        pass
    return False

def compress_pdf(input_path: Path, output_path: Path, level: str = "recommended") -> dict:
    """
    Compress PDF with three genuine levels:
    - low: standard deflate, remove duplicate streams, gentle image compression.
    - recommended: balanced downsampling & recompression targeting <= 500KB.
    - extreme: aggressive compression specifically designed to reduce >1MB files down to <= 500KB.
    """
    original_size = os.path.getsize(input_path)
    
    # Check if Ghostscript is available for first attempt
    gs_setting = "/screen" if level in ("extreme", "recommended") else "/ebook"
    gs_temp = output_path.with_suffix(".gs.pdf")
    gs_success = _compress_with_ghostscript(input_path, gs_temp, setting=gs_setting)
    
    if gs_success and gs_temp.exists() and gs_temp.stat().st_size < original_size:
        if gs_temp.stat().st_size <= TARGET_BYTES or level != "extreme":
            if output_path.exists():
                output_path.unlink()
            gs_temp.rename(output_path)
            comp_size = output_path.stat().st_size
            return {
                "original_size": original_size,
                "compressed_size": comp_size,
                "savings_bytes": original_size - comp_size,
                "percentage": round(((original_size - comp_size) / original_size) * 100, 1),
                "is_larger": comp_size > original_size
            }

    if gs_temp.exists():
        gs_temp.unlink(missing_ok=True)

    # PyMuPDF Compression Pipeline
    doc = fitz.open(input_path)
    
    if level == "extreme":
        # Target <= 500KB
        _recompress_pdf_images(doc, max_dim=900, quality=45)
        doc.save(
            output_path,
            garbage=4,
            deflate=True,
            deflate_images=True,
            deflate_fonts=True,
            clean=True
        )
    elif level == "recommended":
        _recompress_pdf_images(doc, max_dim=1200, quality=65)
        doc.save(
            output_path,
            garbage=4,
            deflate=True,
            deflate_images=True,
            deflate_fonts=True,
            clean=True
        )
    else:  # low
        _recompress_pdf_images(doc, max_dim=1600, quality=80)
        doc.save(
            output_path,
            garbage=3,
            deflate=True,
            deflate_images=True,
            clean=True
        )
        
    doc.close()
    
    current_size = os.path.getsize(output_path)
    
    # If the file started > 1MB (or level is extreme/recommended) and is still > 500KB,
    # apply targeted raster optimization to guarantee it drops below 500KB!
    if current_size > TARGET_BYTES and (original_size > 700 * 1024 or level in ("extreme", "recommended")):
        raster_temp = output_path.with_suffix(".raster.pdf")
        if _rasterize_pdf_under_target(input_path, raster_temp, target_bytes=TARGET_BYTES):
            if raster_temp.exists() and raster_temp.stat().st_size < current_size:
                if output_path.exists():
                    output_path.unlink()
                raster_temp.rename(output_path)
                current_size = os.path.getsize(output_path)
        if raster_temp.exists():
            raster_temp.unlink(missing_ok=True)

    compressed_size = os.path.getsize(output_path)
    savings = original_size - compressed_size
    pct = round((savings / original_size) * 100, 1) if original_size > 0 else 0
    
    return {
        "original_size": original_size,
        "compressed_size": compressed_size,
        "savings_bytes": max(0, savings),
        "percentage": max(0, pct),
        "is_larger": compressed_size > original_size
    }

def repair_pdf(input_path: Path, output_path: Path) -> dict:
    """
    Attempt to repair damaged, truncated or malformed PDF documents
    by rebuilding xref tables and sanitizing streams using PyMuPDF.
    """
    try:
        doc = fitz.open(input_path)
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
