# Production Dockerfile for StrangePDF Backend
FROM python:3.11-slim

# Prevent python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies: LibreOffice, Tesseract OCR, Ghostscript, Fonts
# Note: Use standard 'libreoffice' package without broken non-existent subpackages in Debian 12 (bookworm)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    tesseract-ocr \
    tesseract-ocr-eng \
    ghostscript \
    fonts-dejavu-core \
    fonts-liberation \
    build-essential \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend source
COPY backend /app

# Ensure temp directory exists
RUN mkdir -p /app/temp_uploads

# Expose port (Render/Railway default to $PORT or 8000)
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
