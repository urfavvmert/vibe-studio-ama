from pydantic import BaseModel
from typing import List, Optional

class ContentRequest(BaseModel):
    content: str  # Can be a text snippet or a URL
    tone: Optional[str] = "viral"

class GeneratedContent(BaseModel):
    linkedin_post: str
    tweets: List[str]
    instagram_caption: str

class ContentResponse(BaseModel):
    success: bool
    data: Optional[GeneratedContent] = None
    error: Optional[str] = None
