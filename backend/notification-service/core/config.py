# core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# Service Discovery
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka")
APP_NAME = "notification-service"
APP_HOST = os.getenv("APP_HOST", "localhost")
APP_PORT = int(os.getenv("APP_PORT", 8002))
