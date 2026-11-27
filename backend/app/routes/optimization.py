import json
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Response
from fastapi.responses import FileResponse, JSONResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.compression_service import compress_pdf, repair_pdf

router = APIRouter(prefix="/api/optimization", tags=["Optimization"])

@router.post("/compress")
async def compress_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    level: str = Form("recommended")  # low, recommended, extreme
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_compressed.pdf"
    
    stats = compress_pdf(input_path, output_pdf, level=level)
    
    # Store stats in custom headers for the frontend to display accurately
    headers = {
        "X-Original-Size": str(stats["original_size"]),
        "X-Compressed-Size": str(stats["compressed_size"]),
        "X-Savings-Bytes": str(stats["savings_bytes"]),
        "X-Percentage": str(stats["percentage"]),
        "X-Is-Larger": str(stats["is_larger"]).lower(),
        "Access-Control-Expose-Headers": "X-Original-Size, X-Compressed-Size, X-Savings-Bytes, X-Percentage, X-Is-Larger, Content-Disposition"
    }
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name,
        headers=headers
    )

@router.post("/repair")
async def repair_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_repaired.pdf"
    
    result = repair_pdf(input_path, output_pdf)
    if not result["success"]:
        delete_path(job_dir)
        raise HTTPException(status_code=422, detail=result["message"])
        
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )
