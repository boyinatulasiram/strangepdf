import os
import io
import fitz
from PIL import Image
from docx import Document
import openpyxl
from pptx import Presentation
from pathlib import Path

# Services
from app.services.image_conversion import convert_images_to_pdf, convert_pdf_to_images
from app.services.organization_service import merge_pdfs, split_pdf, rotate_pdf_pages, reorder_pdf_pages
from app.services.compression_service import compress_pdf, repair_pdf
from app.services.editing_service import add_text_to_pdf, add_page_numbers, add_watermark, sign_pdf
from app.services.security_service import protect_pdf, unlock_pdf, change_password, remove_restrictions
from app.services.document_conversion import convert_docx_to_pdf_fallback, convert_pdf_to_docx
from app.services.spreadsheet_slides_conversion import (
    convert_excel_to_pdf, convert_pdf_to_excel,
    convert_powerpoint_to_pdf, convert_pdf_to_powerpoint
)
from app.services.ocr_service import perform_ocr

test_dir = Path("./test_sandbox")
test_dir.mkdir(exist_ok=True)

print("--- 1. Testing Document Creation & Helpers ---")
# Create sample docx
docx_path = test_dir / "sample.docx"
doc = Document()
doc.add_heading("StrangePDF Test Document", 0)
doc.add_paragraph("This is an automated test paragraph.")
doc.save(str(docx_path))

# Convert docx to pdf
pdf_from_docx = test_dir / "from_docx.pdf"
convert_docx_to_pdf_fallback(docx_path, pdf_from_docx)
assert pdf_from_docx.exists() and pdf_from_docx.stat().st_size > 0
print("✓ Word (DOCX) -> PDF fallback successful")

# Convert pdf back to docx
docx_from_pdf = test_dir / "from_pdf.docx"
convert_pdf_to_docx(pdf_from_docx, docx_from_pdf)
assert docx_from_pdf.exists() and docx_from_pdf.stat().st_size > 0
print("✓ PDF -> Word (DOCX) successful")

# Create test images & convert to PDF
img1 = Image.new("RGB", (300, 300), color=(195, 49, 73))
img1_path = test_dir / "img1.jpg"
img1.save(str(img1_path))

img_pdf = test_dir / "from_img.pdf"
convert_images_to_pdf([img1_path], img_pdf)
assert img_pdf.exists()
print("✓ JPG -> PDF successful")

# PDF to JPG
images_out = convert_pdf_to_images(img_pdf, test_dir)
assert len(images_out) > 0
print(f"✓ PDF -> JPG successful ({len(images_out)} pages extracted)")

# Excel -> PDF
xlsx_path = test_dir / "test.xlsx"
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "LabData"
ws.append(["Item", "Level", "Status"])
ws.append(["Demogorgon", "10", "Active"])
ws.append(["Portal", "9", "Open"])
wb.save(str(xlsx_path))

xlsx_pdf = test_dir / "from_excel.pdf"
convert_excel_to_pdf(xlsx_path, xlsx_pdf)
assert xlsx_pdf.exists()
print("✓ Excel -> PDF successful")

# PDF -> Excel
excel_out = test_dir / "extracted.xlsx"
convert_pdf_to_excel(xlsx_pdf, excel_out)
assert excel_out.exists()
print("✓ PDF -> Excel successful")

# PowerPoint -> PDF
pptx_path = test_dir / "test.pptx"
prs = Presentation()
slide = prs.slides.add_slide(prs.slide_layouts[0])
slide.shapes.title.text = "Strange Slides"
prs.save(str(pptx_path))

pptx_pdf = test_dir / "from_pptx.pdf"
convert_powerpoint_to_pdf(pptx_path, pptx_pdf)
assert pptx_pdf.exists()
print("✓ PowerPoint -> PDF successful")

# PDF -> PowerPoint
pptx_out = test_dir / "from_pdf.pptx"
convert_pdf_to_powerpoint(pptx_pdf, pptx_out)
assert pptx_out.exists()
print("✓ PDF -> PowerPoint successful")

print("--- 2. Testing Organization (Merge, Split, Rotate, Reorder) ---")
# Merge
merged_pdf = test_dir / "merged.pdf"
merge_pdfs([img_pdf, pdf_from_docx], merged_pdf)
assert merged_pdf.exists()
doc_m = fitz.open(merged_pdf)
assert len(doc_m) >= 2
doc_m.close()
print("✓ Merge PDF successful")

# Split
splits = split_pdf(merged_pdf, test_dir, split_mode="all")
assert len(splits) >= 2
print(f"✓ Split PDF successful ({len(splits)} pages created)")

# Rotate
rot_pdf = test_dir / "rotated.pdf"
rotate_pdf_pages(merged_pdf, rot_pdf, rotation_angle=90)
assert rot_pdf.exists()
print("✓ Rotate PDF successful")

# Reorder
reord_pdf = test_dir / "reordered.pdf"
reorder_pdf_pages(merged_pdf, reord_pdf, [1, 0])
assert reord_pdf.exists()
print("✓ Reorder PDF successful")

print("--- 3. Testing Optimization (Compress, Repair) ---")
comp_pdf = test_dir / "compressed.pdf"
stats = compress_pdf(merged_pdf, comp_pdf, level="recommended")
assert comp_pdf.exists()
print(f"✓ Compress PDF successful (Original: {stats['original_size']}B, Result: {stats['compressed_size']}B)")

rep_pdf = test_dir / "repaired.pdf"
rep_res = repair_pdf(merged_pdf, rep_pdf)
assert rep_res["success"]
print("✓ Repair PDF successful")

print("--- 4. Testing Editing (Add Text, Page Numbers, Watermark, Sign) ---")
txt_pdf = test_dir / "text_added.pdf"
add_text_to_pdf(merged_pdf, txt_pdf, text="CONFIDENTIAL HAWKINS LAB")
assert txt_pdf.exists()
print("✓ Add Text successful")

num_pdf = test_dir / "numbered.pdf"
add_page_numbers(merged_pdf, num_pdf)
assert num_pdf.exists()
print("✓ Page Numbers successful")

wm_pdf = test_dir / "watermarked.pdf"
add_watermark(merged_pdf, wm_pdf, text="TOP SECRET")
assert wm_pdf.exists()
print("✓ Watermark successful")

sig_pdf = test_dir / "signed.pdf"
sign_pdf(merged_pdf, sig_pdf, signature_img_path=img1_path)
assert sig_pdf.exists()
print("✓ Sign PDF successful")

print("--- 5. Testing Security (Protect, Unlock, Change Password, Restrictions) ---")
prot_pdf = test_dir / "protected.pdf"
protect_pdf(merged_pdf, prot_pdf, user_password="strangepassword123")
assert prot_pdf.exists()

# Unlock
unlocked_pdf = test_dir / "unlocked.pdf"
ok = unlock_pdf(prot_pdf, unlocked_pdf, password="strangepassword123")
assert ok and unlocked_pdf.exists()
print("✓ Protect & Unlock PDF successful")

# Change password
changed_pdf = test_dir / "changed.pdf"
ok_chg = change_password(prot_pdf, changed_pdf, "strangepassword123", "newsecret999")
assert ok_chg
# Verify new password
ok_verify = unlock_pdf(changed_pdf, test_dir / "verify_unlocked.pdf", password="newsecret999")
assert ok_verify
print("✓ Change PDF Password successful")

# Remove restrictions
unrestricted_pdf = test_dir / "unrestricted.pdf"
ok_unres = remove_restrictions(merged_pdf, unrestricted_pdf)
assert ok_unres
print("✓ Remove PDF Restrictions successful")

print("--- 6. Testing OCR ---")
ocr_txt = test_dir / "ocr_text.txt"
ocr_res = perform_ocr(pdf_from_docx, ocr_txt)
assert ocr_txt.exists() and ocr_res["char_count"] > 0
print(f"✓ OCR Text extraction successful ({ocr_res['char_count']} chars extracted)")

print("\n==========================================")
print("ALL STRANGEPDF CORE ENGINES VERIFIED 100%!")
print("==========================================")
