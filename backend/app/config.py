import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "StrangePDF API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    TEMP_DIR: Path = BASE_DIR / "temp_uploads"
    
    # Security & limits
    MAX_UPLOAD_SIZE_MB: int = 50
    FILE_EXPIRATION_SECONDS: int = 1800  # 30 minutes
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Path to external binaries (if installed/overridden)
    LIBREOFFICE_PATH: str = os.getenv("LIBREOFFICE_PATH", "")
    TESSERACT_PATH: str = os.getenv("TESSERACT_PATH", "")
    GHOSTSCRIPT_PATH: str = os.getenv("GHOSTSCRIPT_PATH", "")

    class Config:
        env_file = ".env"

settings = Settings()
settings.TEMP_DIR.mkdir(parents=True, exist_ok=True)
