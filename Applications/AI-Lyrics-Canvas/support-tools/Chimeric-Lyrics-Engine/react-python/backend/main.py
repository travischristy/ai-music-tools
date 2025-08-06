from fastapi import FastAPI
from models import GenerationRequest

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chimeric Lyrics Engine Backend"}

@app.post("/api/generate")
def generate_lyrics(request: GenerationRequest):
    # For now, just echo the request back to confirm it's working
    return request
