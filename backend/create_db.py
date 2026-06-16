from database.db import engine
from models.patient_record import Base

Base.metadata.create_all(bind=engine)

print("Database created successfully")