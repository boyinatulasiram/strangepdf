from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.ocr_service import perform_ocr

router = APIRouter(prefix="/api/ocr", tags=["OCR"])

@router.post("/extract-text")
async def extract_text_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    lang: str = Form("eng")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_txt = job_dir / f"{Path(file.filename).stem}_extracted.txt"
    
    res = perform_ocr(input_path, output_txt, lang=lang)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_txt),
        media_type="text/plain",
        filename=output_txt.name
    )
