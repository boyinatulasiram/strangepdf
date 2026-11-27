from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.editing_service import (
    add_text_to_pdf,
    add_page_numbers,
    add_watermark,
    sign_pdf
)

router = APIRouter(prefix="/api/edit", tags=["Editing"])

@router.post("/add-text")
async def add_text_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    text: str = Form(...),
    page: int = Form(1),
    x: float = Form(50.0),
    y: float = Form(50.0),
    font_size: float = Form(14.0),
    color: str = Form("#C33149")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_text_added.pdf"
    
    add_text_to_pdf(
        input_path, output_pdf,
        text=text, page_number=page,
        x=x, y=y, font_size=font_size, color_hex=color
    )
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/page-numbers")
async def page_numbers_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    position: str = Form("bottom-center"),
    template: str = Form("Page {page} of {total}"),
    start_num: int = Form(1),
    font_size: float = Form(10.0),
    color: str = Form("#12070A")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_numbered.pdf"
    
    add_page_numbers(
        input_path, output_pdf,
        position=position, format_template=template,
        start_number=start_num, font_size=font_size, color_hex=color
    )
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/watermark")
async def watermark_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    text: str = Form(""),
    watermark_image: UploadFile | None = File(None),
    opacity: float = Form(0.3),
    rotation: float = Form(45.0),
    font_size: float = Form(36.0),
    color: str = Form("#C33149")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    
    image_path = None
    if watermark_image and watermark_image.filename:
        image_path, _ = await save_upload_safely(watermark_image, job_dir, {".png", ".jpg", ".jpeg", ".webp"})
        
    output_pdf = job_dir / f"{Path(file.filename).stem}_watermarked.pdf"
    
    add_watermark(
        input_path, output_pdf,
        text=text, image_path=image_path,
        opacity=opacity, rotation=rotation,
        font_size=font_size, color_hex=color
    )
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/sign")
async def sign_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    signature_image: UploadFile = File(...),
    page: int = Form(1),
    x: float = Form(100.0),
    y: float = Form(100.0),
    width: float = Form(150.0),
    height: float = Form(60.0)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    sig_path, _ = await save_upload_safely(signature_image, job_dir, {".png", ".jpg", ".jpeg", ".webp"})
    
    output_pdf = job_dir / f"{Path(file.filename).stem}_signed.pdf"
    
    sign_pdf(
        input_path, output_pdf,
        signature_img_path=sig_path,
        page_number=page,
        x=x, y=y, width=width, height=height
    )
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )
