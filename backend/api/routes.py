from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from services.transcription import transcribe_audio
from services.soap_generator import generate_soap_note
from database.dependencies import get_db
from services.database_service import save_patient_record

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcript = transcribe_audio(file_path)

    soap_note = generate_soap_note(transcript)

    save_patient_record(
        db,
        file.filename,
        transcript,
        soap_note
    )

    return {
        "message": "Audio uploaded successfully",
        "filename": file.filename,
        "transcript": transcript,
        "soap_note": soap_note
    }


@router.get("/records")
def get_records():
    return {
        "message": "Records endpoint working"
    }