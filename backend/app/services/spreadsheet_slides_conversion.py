import fitz
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from pptx import Presentation
from pptx.util import Inches, Pt
from pathlib import Path
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from PIL import Image
import io

def convert_excel_to_pdf(input_xlsx: Path, output_pdf: Path) -> Path:
    """Convert Excel sheets into formatted PDF tables."""
    wb = openpyxl.load_workbook(str(input_xlsx), data_only=True)
    pdf_doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=landscape(letter),
        rightMargin=36, leftMargin=36,
        topMargin=36, bottomMargin=36
    )
    styles = getSampleStyleSheet()
    story = []
    
    for sheetname in wb.sheetnames:
        ws = wb[sheetname]
        story.append(Paragraph(f"Sheet: {sheetname}", styles["Heading2"]))
        story.append(Spacer(1, 8))
        
        table_data = []
        for row in ws.iter_rows(values_only=True):
            if any(cell is not None for cell in row):
                row_vals = [str(c) if c is not None else "" for c in row]
                table_data.append(row_vals)
                
        if table_data:
            t = Table(table_data)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#C33149")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#F3D9B1")),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#C29979")),
            ]))
            story.append(t)
            story.append(Spacer(1, 15))
            
    if not story:
        story.append(Paragraph("[Empty Workbook]", styles["Normal"]))
        
    pdf_doc.build(story)
    return output_pdf

def convert_pdf_to_excel(input_pdf: Path, output_xlsx: Path) -> Path:
    """Extract tables and structured text from PDF into XLSX spreadsheet."""
    doc = fitz.open(input_pdf)
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    
    header_fill = PatternFill(start_color="C33149", end_color="C33149", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    
    for idx, page in enumerate(doc):
        ws = wb.create_sheet(title=f"Page_{idx + 1}")
        
        # PyMuPDF table finder
        tabs = page.find_tables()
        if tabs.tables:
            row_idx = 1
            for t_i, tab in enumerate(tabs):
                ws.cell(row=row_idx, column=1, value=f"Table {t_i + 1}").font = Font(bold=True)
                row_idx += 1
                for row_data in tab.extract():
                    for col_idx, cell_val in enumerate(row_data, start=1):
                        cell = ws.cell(row=row_idx, column=col_idx, value=cell_val)
                    row_idx += 1
                row_idx += 2
        else:
            # Fallback text lines to columns
            text = page.get_text("text")
            row_idx = 1
            for line in text.splitlines():
                if line.strip():
                    parts = line.split("\t") if "\t" in line else [line.strip()]
                    for c_idx, p in enumerate(parts, 1):
                        ws.cell(row=row_idx, column=c_idx, value=p)
                    row_idx += 1
                    
    if not wb.sheetnames:
        wb.create_sheet(title="Empty")
        
    wb.save(str(output_xlsx))
    doc.close()
    return output_xlsx

def convert_powerpoint_to_pdf(input_pptx: Path, output_pdf: Path) -> Path:
    """Convert PowerPoint slides into PDF document pages."""
    prs = Presentation(str(input_pptx))
    pdf_doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=landscape(letter),
        rightMargin=36, leftMargin=36,
        topMargin=36, bottomMargin=36
    )
    styles = getSampleStyleSheet()
    story = []
    
    for idx, slide in enumerate(prs.slides):
        story.append(Paragraph(f"Slide {idx + 1}", styles["Title"]))
        story.append(Spacer(1, 10))
        
        for shape in slide.shapes:
            if shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    if paragraph.text.strip():
                        story.append(Paragraph(paragraph.text, styles["Normal"]))
                        story.append(Spacer(1, 4))
        story.append(Spacer(1, 20))
        
    if not story:
        story.append(Paragraph("[Empty Presentation]", styles["Normal"]))
        
    pdf_doc.build(story)
    return output_pdf

def convert_pdf_to_powerpoint(input_pdf: Path, output_pptx: Path) -> Path:
    """Convert PDF pages into PowerPoint slide presentation."""
    doc = fitz.open(input_pdf)
    prs = Presentation()
    
    # Standard 16:9 widescreen or 4:3
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]  # Blank slide
    
    for page in doc:
        slide = prs.slides.add_slide(blank_layout)
        
        # Render high-res image of page onto slide
        pix = page.get_pixmap(dpi=150)
        img_buffer = io.BytesIO(pix.tobytes("png"))
        
        slide.shapes.add_picture(
            img_buffer,
            Inches(0.5), Inches(0.5),
            width=Inches(9), height=Inches(6.5)
        )
        
    prs.save(str(output_pptx))
    doc.close()
    return output_pptx
