import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.file_cleanup import cleanup_expired_files

# Import modular route handlers
from app.routes.conversion import router as conversion_router
from app.routes.organization import router as organization_router
from app.routes.optimization import router as optimization_router
from app.routes.editing import router as editing_router
from app.routes.security import router as security_router
from app.routes.ocr import router as ocr_router
from app.routes.preview import router as preview_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("strangepdf")

async def periodic_cleanup():
    """Background task running every 5 minutes to purge expired documents."""
    while True:
        try:
            await asyncio.sleep(300)
            cleanup_expired_files()
        except Exception as e:
            logger.error(f"Error in cleanup worker: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure clean temp dir and start cleanup loop
    cleanup_expired_files()
    cleanup_task = asyncio.create_task(periodic_cleanup())
    logger.info("StrangePDF API started successfully with background cleanup.")
    yield
    # Shutdown
    cleanup_task.cancel()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="StrangePDF - All-in-One Online PDF Toolkit Inspired by 1980s Supernatural Sci-Fi",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "Content-Disposition",
        "X-Original-Size",
        "X-Compressed-Size",
        "X-Savings-Bytes",
        "X-Percentage",
        "X-Is-Larger"
    ]
)

# Register routes
app.include_router(conversion_router)
app.include_router(organization_router)
app.include_router(optimization_router)
app.include_router(editing_router)
app.include_router(security_router)
app.include_router(ocr_router)
app.include_router(preview_router)

@app.get("/")
def root():
    return {
        "app": "StrangePDF",
        "status": "online",
        "version": settings.APP_VERSION,
        "tagline": "PDFs Have Never Been This Strange.",
        "message": "Your documents are processed securely and are not permanently stored by StrangePDF. Temporary files are automatically deleted after processing and download."
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": "healthy"}
