import fitz  # PyMuPDF
from pathlib import Path

def merge_pdfs(pdf_paths: list[Path], output_path: Path) -> Path:
    """Merge multiple PDF files in given sequence into one PDF."""
    merged_doc = fitz.open()
    for path in pdf_paths:
        with fitz.open(path) as doc:
            merged_doc.insert_pdf(doc)
    merged_doc.save(output_path)
    merged_doc.close()
    return output_path

def split_pdf(pdf_path: Path, output_dir: Path, split_mode: str = "all", ranges: str = "") -> list[Path]:
    """
    Split PDF into multiple files:
    - 'all': split every page individually
    - 'range': page ranges like '1-3, 5, 7-10'
    """
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    output_files = []
    
    if split_mode == "all":
        for i in range(total_pages):
            single_doc = fitz.open()
            single_doc.insert_pdf(doc, from_page=i, to_page=i)
            out_file = output_dir / f"page_{i + 1}.pdf"
            single_doc.save(out_file)
            single_doc.close()
            output_files.append(out_file)
    else:
        # Parse ranges
        parts = [p.strip() for p in ranges.split(",") if p.strip()]
        for idx, part in enumerate(parts):
            if "-" in part:
                start_str, end_str = part.split("-", 1)
                start = max(1, int(start_str))
                end = min(total_pages, int(end_str))
            else:
                start = end = int(part)
            
            if start <= total_pages and end >= start:
                range_doc = fitz.open()
                range_doc.insert_pdf(doc, from_page=start - 1, to_page=end - 1)
                out_file = output_dir / f"split_part_{idx + 1}_pages_{start}-{end}.pdf"
                range_doc.save(out_file)
                range_doc.close()
                output_files.append(out_file)
                
    doc.close()
    return output_files

def rotate_pdf_pages(pdf_path: Path, output_path: Path, rotation_angle: int = 90, page_indices: list[int] | None = None) -> Path:
    """Rotate specific or all pages of a PDF by 90, 180, or 270 degrees."""
    doc = fitz.open(pdf_path)
    for i, page in enumerate(doc):
        if page_indices is None or i in page_indices:
            page.set_rotation((page.rotation + rotation_angle) % 360)
    doc.save(output_path)
    doc.close()
    return output_path

def reorder_pdf_pages(pdf_path: Path, output_path: Path, new_page_order: list[int]) -> Path:
    """
    Reorder pages based on 0-indexed list of page positions.
    E.g. [2, 0, 1] means page 3 becomes first, page 1 second, page 2 third.
    """
    doc = fitz.open(pdf_path)
    reordered_doc = fitz.open()
    for idx in new_page_order:
        if 0 <= idx < len(doc):
            reordered_doc.insert_pdf(doc, from_page=idx, to_page=idx)
    reordered_doc.save(output_path)
    reordered_doc.close()
    doc.close()
    return output_path
