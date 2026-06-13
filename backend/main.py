from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "SOAP Healthcare AI Scribe Running"
    }