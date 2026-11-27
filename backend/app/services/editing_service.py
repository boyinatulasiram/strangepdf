import fitz  # PyMuPDF
from pathlib import Path
from PIL import Image
import io

def add_text_to_pdf(
    pdf_path: Path,
    output_path: Path,
    text: str,
    page_number: int = 1,
    x: float = 50,
    y: float = 50,
    font_size: float = 14,
    color_hex: str = "#C33149"
) -> Path:
    """Add custom text at specific coordinates to a PDF page."""
    doc = fitz.open(pdf_path)
    if 1 <= page_number <= len(doc):
        page = doc[page_number - 1]
        
        # Convert hex color to normalized RGB (0-1)
        hex_clean = color_hex.lstrip("#")
        r = int(hex_clean[0:2], 16) / 255.0
        g = int(hex_clean[2:4], 16) / 255.0
        b = int(hex_clean[4:6], 16) / 255.0
        
        point = fitz.Point(x, y)
        page.insert_text(point, text, fontsize=font_size, color=(r, g, b))
        
    doc.save(output_path)
    doc.close()
    return output_path

def add_page_numbers(
    pdf_path: Path,
    output_path: Path,
    position: str = "bottom-center",
    format_template: str = "Page {page} of {total}",
    start_number: int = 1,
    font_size: float = 10,
    color_hex: str = "#12070A"
) -> Path:
    """Add formatted page numbers across pages."""
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    
    hex_clean = color_hex.lstrip("#")
    rgb = (
        int(hex_clean[0:2], 16) / 255.0,
        int(hex_clean[2:4], 16) / 255.0,
        int(hex_clean[4:6], 16) / 255.0
    )
    
    for i, page in enumerate(doc):
        current_num = start_number + i
        text = format_template.replace("{page}", str(current_num)).replace("{total}", str(total_pages))
        rect = page.rect
        
        # Determine position
        if position == "bottom-right":
            point = fitz.Point(rect.width - 120, rect.height - 30)
        elif position == "bottom-left":
            point = fitz.Point(40, rect.height - 30)
        elif position == "top-center":
            point = fitz.Point(rect.width / 2 - 40, 40)
        elif position == "top-right":
            point = fitz.Point(rect.width - 120, 40)
        elif position == "top-left":
            point = fitz.Point(40, 40)
        else:  # bottom-center
            point = fitz.Point(rect.width / 2 - 40, rect.height - 30)
            
        page.insert_text(point, text, fontsize=font_size, color=rgb)
        
    doc.save(output_path)
    doc.close()
    return output_path

def add_watermark(
    pdf_path: Path,
    output_path: Path,
    text: str = "",
    image_path: Path | None = None,
    opacity: float = 0.3,
    rotation: float = 45,
    font_size: float = 40,
    color_hex: str = "#C33149"
) -> Path:
    """Add text or image watermark with configurable opacity, rotation and positioning."""
    doc = fitz.open(pdf_path)
    
    hex_clean = color_hex.lstrip("#")
    rgb = (
        int(hex_clean[0:2], 16) / 255.0,
        int(hex_clean[2:4], 16) / 255.0,
        int(hex_clean[4:6], 16) / 255.0
    )
    
    # Map rotation to 0, 90, 180, or 270 degrees acceptable by PyMuPDF text insertion
    morph_angle = int(rotation) % 360
    if morph_angle not in (0, 90, 180, 270):
        # Nearest orthogonal rotation for page.insert_text or fallback to 0
        morph_angle = min([0, 90, 180, 270], key=lambda x: abs(x - morph_angle))

    for page in doc:
        rect = page.rect
        if text:
            center = fitz.Point(rect.width / 2 - (font_size * 2), rect.height / 2)
            page.insert_text(
                center,
                text,
                fontsize=font_size,
                color=rgb,
                rotate=morph_angle
            )
        elif image_path and image_path.exists():
            img_rect = fitz.Rect(
                rect.width * 0.25,
                rect.height * 0.25,
                rect.width * 0.75,
                rect.height * 0.75
            )
            page.insert_image(img_rect, filename=str(image_path), keep_proportion=True)
            
    doc.save(output_path)
    doc.close()
    return output_path

def sign_pdf(
    pdf_path: Path,
    output_path: Path,
    signature_img_path: Path,
    page_number: int = 1,
    x: float = 100,
    y: float = 100,
    width: float = 150,
    height: float = 60
) -> Path:
    """Apply a visual signature stamp to the chosen page."""
    doc = fitz.open(pdf_path)
    if 1 <= page_number <= len(doc):
        page = doc[page_number - 1]
        sig_rect = fitz.Rect(x, y, x + width, y + height)
        page.insert_image(sig_rect, filename=str(signature_img_path), keep_proportion=True)
        
    doc.save(output_path)
    doc.close()
    return output_path
