# main.py
from fastapi import FastAPI
from api.notifications import router as notifications_router
from db.database import init_db

app = FastAPI(
    title="Notification Microservice",
    description="A microservice for handling user notifications.",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(notifications_router, prefix="/notifications", tags=["notifications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Notification Microservice"}
