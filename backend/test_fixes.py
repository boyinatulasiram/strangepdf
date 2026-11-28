import os
from pathlib import Path
from PIL import Image
import fitz

from app.services.organization_service import merge_pdfs
from app.services.compression_service import compress_pdf
from app.services.image_conversion import compress_image_under_target

test_dir = Path("./test_bench")
test_dir.mkdir(exist_ok=True)

print("--- 1. Testing Merge PDF ---")
# Create 3 small PDFs
pdf_paths = []
for i in range(3):
    p = test_dir / f"doc_{i + 1}.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text(fitz.Point(50, 100), f"Document #{i + 1} content", fontsize=20)
    doc.save(p)
    doc.close()
    pdf_paths.append(p)

merged_out = test_dir / "merged_test.pdf"
merge_pdfs(pdf_paths, merged_out)
assert merged_out.exists()
m_doc = fitz.open(merged_out)
assert len(m_doc) == 3
m_doc.close()
print("✓ Merge PDF verified successfully with 3 files! Total pages:", 3)

print("--- 2. Testing Image Compression (<500KB) ---")
# Create an image > 1MB (e.g. 2400x2400 uncompressed noise/pattern)
large_img_path = test_dir / "large_raw.jpg"
img = Image.new("RGB", (2500, 2500), color=(200, 50, 80))
# Add some pixel variations so it doesn't compress to nothing
for x in range(0, 2500, 10):
    for y in range(0, 2500, 10):
        img.putpixel((x, y), (x % 255, y % 255, 100))
img.save(large_img_path, format="JPEG", quality=98)
orig_img_size = large_img_path.stat().st_size
print(f"Generated test image size: {orig_img_size / 1024:.1f} KB")

comp_img_path = test_dir / "compressed_img.jpg"
compress_image_under_target(large_img_path, comp_img_path, target_bytes=500 * 1024)
comp_img_size = comp_img_path.stat().st_size
print(f"Compressed image size: {comp_img_size / 1024:.1f} KB")
assert comp_img_size <= 500 * 1024, "Image compression failed to meet <= 500KB target!"
print("✓ Image compression successfully reduced file below 500 KB!")

print("--- 3. Testing PDF Compression (<500KB for >1MB PDF) ---")
# Create a PDF containing large images that is > 1.2 MB
large_pdf_path = test_dir / "large_test.pdf"
large_doc = fitz.open()
for _ in range(4):
    img_doc = fitz.open("pdf", fitz.open(stream=large_img_path.read_bytes(), filetype="jpeg").convert_to_pdf())
    large_doc.insert_pdf(img_doc)
    img_doc.close()
large_doc.save(large_pdf_path)
large_doc.close()

orig_pdf_size = large_pdf_path.stat().st_size
print(f"Generated test PDF size: {orig_pdf_size / 1024:.1f} KB")

comp_pdf_path = test_dir / "compressed_result.pdf"
stats = compress_pdf(large_pdf_path, comp_pdf_path, level="extreme")
final_pdf_size = comp_pdf_path.stat().st_size
print(f"Compressed PDF size: {final_pdf_size / 1024:.1f} KB (Saved {stats['percentage']}%)")
assert final_pdf_size <= 500 * 1024, "PDF compression failed to meet <= 500KB target!"
print("✓ PDF compression successfully brought >1MB file below 500 KB!")

print("\n==========================================")
print("ALL REQUESTED FIXES TESTED & VERIFIED 100%!")
print("==========================================")
