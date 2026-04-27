from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import socketio
import uvicorn
import uuid
import os
import asyncio
from services import parser, automation
from config import GEMINI_API_KEY

app = FastAPI(title="JobPilot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.io setup
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# In-memory storage (Stateless - cleared on restart)
# In a real app, this might be Redis with TTL, but for hackathon, a dict is fine.
sessions = {}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@app.get("/")
async def root():
    print("BACKEND LOG: Root endpoint '/' was accessed")
    return {"message": "JobPilot API is online (Stateless Mode)"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    print(f"BACKEND LOG: Upload endpoint hit with file: {file.filename}")
    # Save to a temporary location to parse
    temp_path = f"tmp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        data = parser.parse_resume(temp_path)
        os.remove(temp_path)
        return data
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/start-automation")
async def start_automation(
    email: str = Form(...),
    password: str = Form(...),
    resume_text: str = Form(...),
    skills: str = Form(...)
):
    print(f"BACKEND LOG: Start automation endpoint hit for email: {email}")
    session_id = str(uuid.uuid4())
    # Start the automation in the background
    asyncio.create_task(automation.run_automation(email, password, resume_text, skills, sio))
    return {"session_id": session_id, "status": "started"}

if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
