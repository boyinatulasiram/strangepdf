import subprocess
import shutil
from pathlib import Path
import fitz
from docx import Document
from app.config import settings

def find_libreoffice() -> str | None:
    if settings.LIBREOFFICE_PATH and Path(settings.LIBREOFFICE_PATH).exists():
        return settings.LIBREOFFICE_PATH
    for cmd in ["soffice", "libreoffice", "soffice.exe"]:
        path = shutil.which(cmd)
        if path:
            return path
    # Common Windows paths
    win_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"
    ]
    for p in win_paths:
        if Path(p).exists():
            return p
    return None

def convert_office_to_pdf_headless(input_file: Path, output_dir: Path) -> Path | None:
    """Use LibreOffice headless to convert doc, docx, xls, xlsx, ppt, pptx to PDF."""
    lo_bin = find_libreoffice()
    if not lo_bin:
        return None
    try:
        cmd = [
            lo_bin,
            "--headless",
            "--convert-to", "pdf",
            "--outdir", str(output_dir),
            str(input_file)
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=60)
        expected_pdf = output_dir / f"{input_file.stem}.pdf"
        if expected_pdf.exists():
            return expected_pdf
    except Exception:
        pass
    return None

def convert_docx_to_pdf_fallback(input_docx: Path, output_pdf: Path) -> Path:
    """
    Fallback converter for DOCX -> PDF when LibreOffice is not installed in the local environment.
    Uses python-docx to extract paragraphs and tables, and ReportLab / PyMuPDF to render clean PDF.
    """
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib import colors

    doc = Document(str(input_docx))
    pdf_doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    story = []
    
    for p in doc.paragraphs:
        if p.text.strip():
            # Basic style mapping
            p_style = styles["Normal"]
            if p.style.name.startswith("Heading 1"):
                p_style = styles["Heading1"]
            elif p.style.name.startswith("Heading 2"):
                p_style = styles["Heading2"]
            elif p.style.name.startswith("Title"):
                p_style = styles["Title"]
            story.append(Paragraph(p.text, p_style))
            story.append(Spacer(1, 8))
            
    for tbl in doc.tables:
        data = []
        for row in tbl.rows:
            row_data = [cell.text.strip() for cell in row.cells]
            data.append(row_data)
        if data:
            t = Table(data)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#C29979")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#D9B99B")),
            ]))
            story.append(t)
            story.append(Spacer(1, 12))
            
    if not story:
        story.append(Paragraph("[Empty Document]", styles["Normal"]))
        
    pdf_doc.build(story)
    return output_pdf

def convert_pdf_to_docx(input_pdf: Path, output_docx: Path) -> Path:
    """
    Convert PDF to editable DOCX.
    Tries pdf2docx first; if not present, uses PyMuPDF + python-docx parser.
    """
    try:
        from pdf2docx import Converter
        cv = Converter(str(input_pdf))
        cv.convert(str(output_docx))
        cv.close()
        return output_docx
    except Exception:
        # Robust fallback using PyMuPDF to python-docx
        fitz_doc = fitz.open(input_pdf)
        docx_doc = Document()
        for i, page in enumerate(fitz_doc):
            docx_doc.add_heading(f"Page {i + 1}", level=2)
            text = page.get_text("text")
            for line in text.splitlines():
                if line.strip():
                    docx_doc.add_paragraph(line)
        docx_doc.save(str(output_docx))
        fitz_doc.close()
        return output_docx
