from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from services.transcription import transcribe_audio
from services.soap_generator import generate_soap_note
from services.icd10_mapper import get_icd10_codes

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

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcribe audio
    transcript = transcribe_audio(file_path)

    # Generate SOAP note
    soap_note = generate_soap_note(transcript)

    # Generate ICD-10 codes
    icd10_codes = get_icd10_codes(transcript)

    # Save to database
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
        "soap_note": soap_note,
        "icd10_codes": icd10_codes
    }


@router.get("/")
def home():
    return {
        "message": "SOAP Healthcare AI Scribe API Running"
    }


@router.get("/records")
def get_records():
    return {
        "message": "Records endpoint working"
    }