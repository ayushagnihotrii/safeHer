"""FastAPI backend for the Suspicious Conversation Analyzer."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from analyzer import analyze_conversation
from samples import get_sample_conversations

# Load .env file
load_dotenv()

app = FastAPI(
    title="Suspicious Conversation Analyzer",
    description="AI-powered conversation analysis for detecting scams and manipulation.",
    version="1.0.0",
)

# CORS — allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request / Response Models ----------


class ConversationRequest(BaseModel):
    conversation: str

    @field_validator("conversation")
    @classmethod
    def conversation_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Conversation text cannot be empty.")
        return v.strip()


# ---------- Routes ----------


@app.get("/")
async def root():
    return {"message": "Suspicious Conversation Analyzer API", "status": "running"}


@app.get("/api/sample-conversations")
async def sample_conversations():
    """Return preset sample conversations."""
    return {"samples": get_sample_conversations()}


@app.post("/api/analyze")
async def analyze(request: ConversationRequest):
    """Analyze a conversation for suspicious patterns using Claude AI."""
    # Check API key is configured
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured on the server.",
        )

    try:
        result = analyze_conversation(request.conversation)
        return {"success": True, "analysis": result}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
