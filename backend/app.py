from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from routes import workers, policies, claims, admin, heatmap
from services.background_tasks import check_disruption_triggers_job
from core.logger import logger
from models.schemas import ErrorResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing GigShield backend services...")
    # Startup: spawn the background task
    task = asyncio.create_task(check_disruption_triggers_job())
    yield
    # Shutdown: cancel task if needed
    logger.info("Shutting down GigShield backend services...")
    task.cancel()

tags_metadata = [
    {"name": "workers", "description": "Gig worker onboarding and risk profiles."},
    {"name": "policies", "description": "Parametric policy issuance and automated premium pricing."},
    {"name": "claims", "description": "Adjudication and fraud simulation for triggers."},
    {"name": "admin", "description": "System operational statistics."},
    {"name": "heatmap", "description": "Spatial mapping datasets for front-end rendering."}
]

app = FastAPI(
    title="GigShield AI API",
    description="Backend for AI-powered parametric insurance platform processing micro-claims dynamically via ML inferences.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "GigShield Engineering",
        "url": "https://gigshield.dev",
        "email": "api@gigshield.dev",
    },
    lifespan=lifespan
)

# Global Exception Handlers for structured logging and output
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format standard Pydantic validation errors into our clean ErrorResponse schema."""
    logger.error(f"Validation error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            success=False,
            error_code="VALIDATION_ERROR",
            message="Input payload failed structural validation.",
            details={"errors": exc.errors()}
        ).model_dump() if hasattr(ErrorResponse, 'model_dump') else ErrorResponse(
            success=False,
            error_code="VALIDATION_ERROR",
            message="Input payload failed structural validation.",
            details={"errors": exc.errors()}
        ).dict()
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions to avoid returning messy internal stack traces to clients."""
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            success=False,
            error_code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred."
        ).model_dump() if hasattr(ErrorResponse, 'model_dump') else ErrorResponse(
            success=False,
            error_code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred."
        ).dict()
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workers.router, prefix="/api/v1")
app.include_router(policies.router, prefix="/api/v1")
app.include_router(claims.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(heatmap.router, prefix="/api/v1")

@app.get("/", tags=["system"])
async def root():
    logger.info("Root endpoint hit")
    return {"message": "Welcome to GigShield AI API", "docs": "/docs", "status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)