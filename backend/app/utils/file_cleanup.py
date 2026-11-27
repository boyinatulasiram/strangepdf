import os
import time
import shutil
import logging
from pathlib import Path
from app.config import settings

logger = logging.getLogger("strangepdf.cleanup")

def cleanup_expired_files():
    """
    Scans the temporary storage directory and removes jobs/files older than FILE_EXPIRATION_SECONDS.
    Ensures zero permanent storage.
    """
    now = time.time()
    temp_dir = settings.TEMP_DIR
    if not temp_dir.exists():
        return

    for item in temp_dir.iterdir():
        try:
            # Check modification/creation time
            stats = item.stat()
            file_age = now - stats.st_mtime
            if file_age > settings.FILE_EXPIRATION_SECONDS:
                if item.is_dir():
                    shutil.rmtree(item, ignore_errors=True)
                else:
                    item.unlink(missing_ok=True)
                logger.info(f"Cleaned up expired temporary file/dir: {item.name}")
        except Exception as e:
            logger.warning(f"Error cleaning up {item.name}: {e}")

def delete_path(path: Path | str):
    """Safely delete a file or directory immediately."""
    p = Path(path)
    if not p.exists():
        return
    try:
        if p.is_dir():
            shutil.rmtree(p, ignore_errors=True)
        else:
            p.unlink(missing_ok=True)
        logger.info(f"Deleted temporary path: {p}")
    except Exception as e:
        logger.warning(f"Could not immediately delete {p}: {e}")
