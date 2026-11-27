import fitz
import base64
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path

router = APIRouter(prefix="/api/preview", tags=["Preview"])

@router.post("/thumbnails")
async def generate_thumbnails(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Generate low-res page thumbnails and document metadata for interactive
    reordering, visual splitting, and quick previews without keeping files.
    """
    job_dir = get_job_dir()
    input_path, size = await save_upload_safely(file, job_dir, {".pdf"})
    
    doc = fitz.open(input_path)
    total_pages = len(doc)
    
    thumbnails = []
    # Up to first 50 pages for interactive preview
    for i in range(min(total_pages, 50)):
        page = doc[i]
        pix = page.get_pixmap(dpi=72)
        img_bytes = pix.tobytes("jpeg")
        b64 = base64.b64encode(img_bytes).decode("ascii")
        thumbnails.append({
            "page": i + 1,
            "width": page.rect.width,
            "height": page.rect.height,
            "image": f"data:image/jpeg;base64,{b64}"
        })
        
    doc.close()
    background_tasks.add_task(delete_path, job_dir)
    
    return {
        "filename": file.filename,
        "size": size,
        "total_pages": total_pages,
        "thumbnails": thumbnails
    }
