from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.security_service import (
    protect_pdf,
    unlock_pdf,
    change_password,
    remove_restrictions
)

router = APIRouter(prefix="/api/security", tags=["Security"])

@router.post("/protect")
async def protect_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty.")
        
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_protected.pdf"
    
    protect_pdf(input_path, output_pdf, user_password=password)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/unlock")
async def unlock_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_unlocked.pdf"
    
    success = unlock_pdf(input_path, output_pdf, password)
    if not success:
        delete_path(job_dir)
        raise HTTPException(status_code=403, detail="Incorrect password. Decryption failed.")
        
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/change-password")
async def change_password_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    old_password: str = Form(...),
    new_password: str = Form(...)
):
    if not new_password:
        raise HTTPException(status_code=400, detail="New password cannot be empty.")
        
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_new_pwd.pdf"
    
    success = change_password(input_path, output_pdf, old_password, new_password)
    if not success:
        delete_path(job_dir)
        raise HTTPException(status_code=403, detail="Current password verification failed.")
        
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/remove-restrictions")
async def remove_restrictions_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form("")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_unrestricted.pdf"
    
    success = remove_restrictions(input_path, output_pdf, password=password)
    if not success:
        delete_path(job_dir)
        raise HTTPException(status_code=403, detail="Could not remove restrictions with the provided credentials.")
        
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )
