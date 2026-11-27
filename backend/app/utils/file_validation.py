import os
import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile
from app.config import settings

ALLOWED_EXTENSIONS = {
    # Documents
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    # Images
    ".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"
}

MAGIC_SIGNATURES = {
    b"%PDF-": ".pdf",
    b"\x50\x4B\x03\x04": [".docx", ".xlsx", ".pptx", ".zip"],  # ZIP based Office docs
    b"\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1": [".doc", ".xls", ".ppt"],  # Legacy OLE Office docs
    b"\xFF\xD8\xFF": ".jpg",
    b"\x89PNG\r\n\x1a\n": ".png",
    b"RIFF": ".webp",
    b"BM": ".bmp"
}

def validate_file_extension(filename: str, allowed: set[str] = None) -> str:
    ext = Path(filename).suffix.lower()
    allowed_set = allowed if allowed else ALLOWED_EXTENSIONS
    if ext not in allowed_set:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(sorted(allowed_set))}"
        )
    return ext

def secure_random_name(ext: str) -> str:
    """Generate cryptographically secure random filename with clean extension."""
    return f"{uuid.uuid4().hex}{ext}"

def get_job_dir() -> Path:
    """Generate an isolated temporary job directory."""
    job_id = uuid.uuid4().hex
    job_path = settings.TEMP_DIR / job_id
    job_path.mkdir(parents=True, exist_ok=True)
    return job_path

async def save_upload_safely(upload_file: UploadFile, target_dir: Path, allowed_exts: set[str] = None) -> tuple[Path, int]:
    ext = validate_file_extension(upload_file.filename, allowed_exts)
    safe_name = secure_random_name(ext)
    dest_path = target_dir / safe_name
    
    bytes_written = 0
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    
    with open(dest_path, "wb") as f:
        while chunk := await upload_file.read(1024 * 64):
            bytes_written += len(chunk)
            if bytes_written > max_bytes:
                dest_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB"
                )
            f.write(chunk)
            
    return dest_path, bytes_written
