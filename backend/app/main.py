
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes.document import router as document_router

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "FORM_SAATHI_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

# Create the FormSaathi application
app = FastAPI(
    title="FormSaathi API",
    description="AI-powered multilingual document accessibility platform",
    version="1.0.0"
)

# Allow communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register document upload routes
app.include_router(
    document_router,
    prefix="/api",
    tags=["Documents"]
)

# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to FormSaathi!",
        "status": "Backend is running successfully"
    }

# Health check route
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
