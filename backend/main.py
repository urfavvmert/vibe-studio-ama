from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ContentRequest, ContentResponse
from services.ai_service import generate_social_content

app = FastAPI(title="Vibe Content Pro API")

# Setup CORS to allow React frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate", response_model=ContentResponse)
async def generate_content(request_data: ContentRequest):
    try:
        if not request_data.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty.")
            
        generated_data = await generate_social_content(request_data.content, request_data.tone)
        
        if not generated_data:
            raise HTTPException(status_code=400, detail="Failed to extract content or URL is invalid.")
            
        return ContentResponse(success=True, data=generated_data)
        
    except Exception as e:
        return ContentResponse(success=False, error=str(e))
