# STRANGEPDF 🔦⚡
> *"PDFs Have Never Been This Strange."*  
> *"Everything You Need for PDFs. Nothing Strange About It."*

**StrangePDF** is an all-in-one, privacy-focused online PDF toolkit with a nostalgic 1980s supernatural sci-fi aesthetic. Convert, compress, edit, organize, secure, and inspect PDF documents through an intuitive web application — without mandatory registrations, third-party API exposure, or permanent document retention.

---

## 🎨 Official Brand Identity & Palette

StrangePDF strictly uses the official 5-color Hawkins aesthetic:
1. **Crimson Red (`#C33149`)**: Primary buttons, brand highlights, interactive elements.
2. **Retro Lime (`#A8C256`)**: Success indicators, positive feedback, secondary accents.
3. **Warm Cream (`#F3D9B1`)**: Main background, tool cards, light surfaces.
4. **Vintage Tan (`#C29979`)**: Retro drop-shadows, borders, muted controls.
5. **Deep Blood Red (`#A22522`)**: Headings, dark footer, dramatic sections.

---

## 🛠️ Complete Feature Matrix (25+ Tools Implemented)

### Category A: PDF Conversion
- **Word to PDF (`/api/convert/word-to-pdf`)**: Convert DOC and DOCX files into PDF with LibreOffice headless and python-docx fallback.
- **PDF to Word (`/api/convert/pdf-to-word`)**: Convert PDF documents into editable Word DOCX files.
- **JPG to PDF (`/api/convert/jpg-to-pdf`)**: Turn JPG, PNG, and WebP images into clean single or multi-page PDFs.
- **PDF to JPG (`/api/convert/pdf-to-jpg`)**: Extract PDF pages as high-resolution JPG images (individual or ZIP download).
- **Excel to PDF (`/api/convert/excel-to-pdf`)**: Convert XLS and XLSX spreadsheets into styled PDF tables.
- **PDF to Excel (`/api/convert/pdf-to-excel`)**: Detect and extract document tables into editable Excel worksheets.
- **PowerPoint to PDF (`/api/convert/powerpoint-to-pdf`)**: Convert PPT and PPTX presentation decks into PDF slides.
- **PDF to PowerPoint (`/api/convert/pdf-to-powerpoint`)**: Convert PDF pages into presentation-ready slide decks.

### Category B: PDF Organization
- **Merge PDF (`/api/organize/merge`)**: Combine multiple PDF files in any order.
- **Split PDF (`/api/organize/split`)**: Extract all pages separately or split by custom ranges (e.g. `1-3, 5, 7-10`).
- **Rotate PDF (`/api/organize/rotate`)**: Rotate all or selected pages by 90°, 180°, or 270°.
- **Reorder PDF (`/api/organize/reorder`)**: Drag and drop visual page order rearrangements.

### Category C: PDF Optimization
- **Compress PDF (`/api/optimization/compress`)**: Real file size optimization with 3 genuine levels (*Low*, *Recommended*, *Extreme*). Returns actual byte savings and exact percentages.
- **Repair PDF (`/api/optimization/repair`)**: Reconstructs damaged xref tables and sanitizes corrupted streams.

### Category D: PDF Editing
- **Add Text (`/api/edit/add-text`)**: Insert custom text annotations with custom position, size, and hex color.
- **Page Numbers (`/api/edit/page-numbers`)**: Add header/footer page numbers across custom formats.
- **Watermark (`/api/edit/watermark`)**: Apply custom rotated text or image watermarks with opacity controls.
- **Sign PDF (`/api/edit/sign`)**: Stamp visual signatures on any page at precise coordinates.

### Category E: PDF Security
- **Protect PDF (`/api/security/protect`)**: Encrypt PDF with standard AES encryption.
- **Remove PDF Password (`/api/security/unlock`)**: Verify password and remove encryption.
- **Change PDF Password (`/api/security/change-password`)**: Authenticate existing password and apply a new password.
- **Remove PDF Restrictions (`/api/security/remove-restrictions`)**: Clear authorized printing/copying restrictions.

### Category F: Additional Features
- **OCR Text Scanner (`/api/ocr/extract-text`)**: Extract text layers from scanned PDFs with Tesseract OCR.
- **Document Previews (`/api/preview/thumbnails`)**: Generates interactive low-res page previews on demand.
- **Zero Permanent Storage**: Immediate background cleanup and automated periodic purging of expired files.

---

## 🔒 Security & Privacy Guarantees

> *"Your documents are processed securely and are not permanently stored by StrangePDF. Temporary files are automatically deleted after processing and download."*

1. **No External Conversion APIs**: All operations run inside our own backend server instances.
2. **Zero Permanent Storage**: Files are saved only in isolated temporary job directories.
3. **Automatic Cleanup**: Temporary files are deleted immediately after download and swept by a background worker every 5 minutes.
4. **No Password Logging**: Document passwords are held in memory strictly during cipher execution and are never recorded.
5. **No Mandatory Accounts**: No sign-up, email collection, or cookies required.

---

## 🚀 Running Locally

### Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Running with Docker
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

---

## 🌐 Production Deployment

- **Backend**: Ready for Render, Railway, or Fly.io using the root `Dockerfile`.
- **Frontend**: Ready for Vercel, Netlify, or Cloudflare Pages (`cd frontend && npm run build`). Set `VITE_API_BASE_URL` to your live backend domain.
