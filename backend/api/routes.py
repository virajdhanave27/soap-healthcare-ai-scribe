from fastapi import APIRouter, UploadFile, File
import shutil
import os

from services.transcription import transcribe_audio

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcript = transcribe_audio(file_path)

    return {
        "message": "Audio uploaded successfully",
        "filename": file.filename,
        "transcript": transcript
    }