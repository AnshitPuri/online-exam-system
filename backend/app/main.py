from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.routes import auth, exams, questions, attempts, admin, users, student

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    Base.metadata.create_all(bind=engine)
    yield
    logger.info("Shutting down application...")

# ---------------- APP ----------------
app = FastAPI(
    title="Online Examination System API",
    version="1.0.0",
    description="Backend API for Online Examination System",
    lifespan=lifespan
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ERROR HANDLER ----------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {str(exc)}")
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )

# ---------------- ROUTES ----------------
@app.get("/")
async def root():
    return {
        "message": "Online Examination System API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(student.router)