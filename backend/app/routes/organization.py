import json
import zipfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.utils.file_validation import save_upload_safely, get_job_dir
from app.utils.file_cleanup import delete_path
from app.services.organization_service import (
    merge_pdfs,
    split_pdf,
    rotate_pdf_pages,
    reorder_pdf_pages
)

router = APIRouter(prefix="/api/organize", tags=["Organization"])

@router.post("/merge")
async def merge_endpoint(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...)
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required for merging.")
        
    job_dir = get_job_dir()
    pdf_paths = []
    for f in files:
        p, _ = await save_upload_safely(f, job_dir, {".pdf"})
        pdf_paths.append(p)
        
    output_pdf = job_dir / "strangepdf_merged.pdf"
    merge_pdfs(pdf_paths, output_pdf)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename="strangepdf_merged.pdf"
    )

@router.post("/split")
async def split_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    split_mode: str = Form("all"),  # 'all' or 'range'
    ranges: str = Form("")
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    
    split_dir = job_dir / "extracted_pages"
    split_dir.mkdir(parents=True, exist_ok=True)
    
    outputs = split_pdf(input_path, split_dir, split_mode=split_mode, ranges=ranges)
    if not outputs:
        raise HTTPException(status_code=400, detail="No pages were generated from split parameters.")
        
    if len(outputs) == 1:
        background_tasks.add_task(delete_path, job_dir)
        return FileResponse(
            str(outputs[0]),
            media_type="application/pdf",
            filename=outputs[0].name
        )
    else:
        zip_path = job_dir / f"{Path(file.filename).stem}_split.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for out in outputs:
                zipf.write(out, arcname=out.name)
                
        background_tasks.add_task(delete_path, job_dir)
        return FileResponse(
            str(zip_path),
            media_type="application/zip",
            filename=zip_path.name
        )

@router.post("/rotate")
async def rotate_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    angle: int = Form(90),
    pages: str = Form("all")  # 'all' or comma separated e.g. '1, 3, 5'
):
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_rotated.pdf"
    
    page_indices = None
    if pages != "all":
        try:
            page_indices = [int(p.strip()) - 1 for p in pages.split(",") if p.strip()]
        except ValueError:
            page_indices = None
            
    rotate_pdf_pages(input_path, output_pdf, rotation_angle=angle, page_indices=page_indices)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )

@router.post("/reorder")
async def reorder_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    order: str = Form(...)  # JSON string array of 0-based page indices e.g. "[2,0,1]"
):
    try:
        new_order = json.loads(order)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order JSON format.")
        
    job_dir = get_job_dir()
    input_path, _ = await save_upload_safely(file, job_dir, {".pdf"})
    output_pdf = job_dir / f"{Path(file.filename).stem}_reordered.pdf"
    
    reorder_pdf_pages(input_path, output_pdf, new_order)
    
    background_tasks.add_task(delete_path, job_dir)
    return FileResponse(
        str(output_pdf),
        media_type="application/pdf",
        filename=output_pdf.name
    )
