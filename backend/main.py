from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="SOAP Healthcare AI Scribe"
)

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "SOAP Healthcare AI Scribe Running"
    }