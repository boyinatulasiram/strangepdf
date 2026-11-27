import fitz  # PyMuPDF
from pathlib import Path
from pypdf import PdfReader, PdfWriter

def protect_pdf(pdf_path: Path, output_path: Path, user_password: str, owner_password: str = None) -> Path:
    """Encrypt PDF using standard 128-bit/256-bit AES protection."""
    reader = PdfReader(str(pdf_path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    
    # Encrypt
    owner_pwd = owner_password if owner_password else user_password
    writer.encrypt(user_password=user_password, owner_password=owner_pwd)
    
    with open(output_path, "wb") as f:
        writer.write(f)
        
    return output_path

def unlock_pdf(pdf_path: Path, output_path: Path, password: str) -> bool:
    """Verify password and remove encryption."""
    doc = fitz.open(pdf_path)
    if doc.is_encrypted:
        success = doc.authenticate(password)
        if not success:
            doc.close()
            return False
            
    # Save decrypted
    doc.save(output_path)
    doc.close()
    return True

def change_password(pdf_path: Path, output_path: Path, old_password: str, new_password: str) -> bool:
    """Verify existing password and set new password."""
    doc = fitz.open(pdf_path)
    if doc.is_encrypted:
        if not doc.authenticate(old_password):
            doc.close()
            return False
    
    # Temp save decrypted in memory, then re-encrypt
    temp_bytes = doc.tobytes()
    doc.close()
    
    reader = PdfReader(fitz.io.BytesIO(temp_bytes))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
        
    writer.encrypt(user_password=new_password)
    with open(output_path, "wb") as f:
        writer.write(f)
        
    return True

def remove_restrictions(pdf_path: Path, output_path: Path, password: str = "") -> bool:
    """Remove permissions/printing/copying restrictions if authorized."""
    doc = fitz.open(pdf_path)
    if doc.is_encrypted:
        if password and not doc.authenticate(password):
            doc.close()
            return False
            
    # By saving a new unencryped copy, restrictions are cleared
    doc.save(output_path, clean=True)
    doc.close()
    return True
