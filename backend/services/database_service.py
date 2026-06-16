from sqlalchemy.orm import Session
from models.patient_record import PatientRecord

def save_patient_record(
    db: Session,
    filename: str,
    transcript: str,
    soap_note: str
):
    record = PatientRecord(
        filename=filename,
        transcript=transcript,
        soap_note=soap_note
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record