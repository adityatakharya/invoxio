from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import uvicorn
import os

app = FastAPI()

# Initialize VADER sentiment intensity analyzer
sia = SentimentIntensityAnalyzer()

# Configure CORS
origins = [
    "*",  # Allow all origins; adjust this as needed for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.post("/analyze_sentiment")
async def analyze_sentiment(payload: TextInput):
    try:
        # Perform sentiment analysis
        sentiment_scores = sia.polarity_scores(payload.text)
        sentiment = "Neutral"
        if sentiment_scores['compound'] >= 0.05:
            sentiment = "Positive"
        elif sentiment_scores['compound'] <= -0.05:
            sentiment = "Negative"
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")  # Default to all interfaces
    port = int(os.getenv("PORT", 8001))  # Default port, can be overridden by deployment
    uvicorn.run(app, host=host, port=port)
