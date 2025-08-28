# main.py
from fastapi import FastAPI
from api.notifications import router as notifications_router
from db.database import init_db

from contextlib import asynccontextmanager
import py_eureka_client.eureka_client as eureka_client
from core.config import EUREKA_SERVER, APP_NAME, APP_HOST, APP_PORT

@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    print("Starting up...")
    init_db()
    # register with eureka server
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name=APP_NAME,
        instance_port=APP_PORT,
        instance_host=APP_HOST
    )
    yield
    # on shutdown
    print("Shutting down...")
    await eureka_client.stop_async()

app = FastAPI(
    lifespan=lifespan,
    title="Notification Service",
    description="A microservice for handling user notifications.",
    version="1.0.0"
)

app.include_router(notifications_router, prefix="/notifications", tags=["notifications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Notification Microservice"}
