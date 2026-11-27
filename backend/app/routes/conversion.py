import os
import zipfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.image_conversion import convert_images_to_pdf, convert_pdf_to_images
from app.services.document_conversion import (
    convert_office_to_pdf_headless,
    convert_docx_to_pdf_fallback,
    convert_pdf_to_docx
)
from app.services.spreadsheet_slides_conversion import (
    convert_excel_to_pdf,
    convert_pdf_to_excel,
    convert_powerpoint_to_pdf,
    convert_pdf_to_powerpoint
)

router = APIRouter(prefix="/api/convert", tags=["Conversion"])

@router.post("/word-to-pdf")
async def word_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".doc", ".docx"})
    
    # Try headless LibreOffice first, then python-docx fallback
    output_pdf = job_dir / f"{Path(file.filename).stem}.pdf"
    res = convert_office_to_pdf_headless(input_path, job_dir)
    if not res or not res.exists():
        if input_path.suffix.lower() == ".docx":
            output_pdf = convert_docx_to_pdf_fallback(input_path, output_pdf)
        else:
            raise HTTPException(status_code=500, detail="Document conversion failed.")
    else:
        output_pdf = res

    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=f"{Path(file.filename).stem}.pdf"
    )

@router.post("/pdf-to-word")
async def pdf_to_word_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_docx = job_dir / f"{Path(file.filename).stem}.docx"
    
    convert_pdf_to_docx(input_path, output_docx)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_docx),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=f"{Path(file.filename).stem}.docx"
    )

@router.post("/jpg-to-pdf")
async def jpg_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    job_dir = get_job_dir()
    image_paths = []
    for f in files:
        p, _ = await save_upload_safely(f, job_dir, {".jpg", ".jpeg", ".png", ".webp", ".bmp"})
        image_paths.append(p)
        
    output_pdf = job_dir / "converted_images.pdf"
    convert_images_to_pdf(image_paths, output_pdf)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename="converted_images.pdf"
    )

@router.post("/pdf-to-jpg")
async def pdf_to_jpg_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    dpi: int = Form(150),
    format: str = Form("jpg")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    
    img_dir = job_dir / "pages"
    img_dir.mkdir(parents=True, exist_ok=True)
    images = convert_pdf_to_images(input_path, img_dir, dpi=dpi, format=format)
    
    if len(images) == 1:
        background_tasks.add_task(delete_path, job_dir)
        return FileResponse(
            str(images[0]),
            media_type=f"image/{format}",
            filename=images[0].name
        )
    else:
        # Create ZIP
        zip_path = job_dir / f"{Path(file.filename).stem}_images.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for img in images:
                zipf.write(img, arcname=img.name)
                
        background_tasks.add_task(delete_path, job_dir)
        return FileResponse(
            str(zip_path),
            media_type="application/zip",
            filename=zip_path.name
        )

@router.post("/excel-to-pdf")
async def excel_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".xlsx", ".xls"})
    output_pdf = job_dir / f"{Path(file.filename).stem}.pdf"
    
    res = convert_office_to_pdf_headless(input_path, job_dir)
    if not res or not res.exists():
        if input_path.suffix.lower() == ".xlsx":
            output_pdf = convert_excel_to_pdf(input_path, output_pdf)
        else:
            raise HTTPException(status_code=500, detail="Excel to PDF conversion failed.")
    else:
        output_pdf = res

    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=f"{Path(file.filename).stem}.pdf"
    )

@router.post("/pdf-to-excel")
async def pdf_to_excel_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_xlsx = job_dir / f"{Path(file.filename).stem}.xlsx"
    
    convert_pdf_to_excel(input_path, output_xlsx)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_xlsx),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=output_xlsx.name
    )

@router.post("/powerpoint-to-pdf")
async def powerpoint_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pptx", ".ppt"})
    output_pdf = job_dir / f"{Path(file.filename).stem}.pdf"
    
    res = convert_office_to_pdf_headless(input_path, job_dir)
    if not res or not res.exists():
        if input_path.suffix.lower() == ".pptx":
            output_pdf = convert_powerpoint_to_pdf(input_path, output_pdf)
        else:
            raise HTTPException(status_code=500, detail="PowerPoint to PDF conversion failed.")
    else:
        output_pdf = res

    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=f"{Path(file.filename).stem}.pdf"
    )

@router.post("/pdf-to-powerpoint")
async def pdf_to_powerpoint_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pptx = job_dir / f"{Path(file.filename).stem}.pptx"
    
    convert_pdf_to_powerpoint(input_path, output_pptx)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pptx),
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename=output_pptx.name
    )
