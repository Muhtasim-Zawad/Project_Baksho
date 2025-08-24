# main.py
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Header
from sqlmodel import Session
import py_eureka_client.eureka_client as eureka_client

# --- CORRECTED IMPORTS ---
from db.session import create_db_and_tables, get_session
from core.config import EUREKA_SERVER, APP_NAME, APP_HOST, APP_PORT
from schemas.campaign import CampaignCreate, CampaignRead
from crud import campaign as campaign_crud
# -------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    print("Starting up...")
    create_db_and_tables()
    # Register with Eureka
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name=APP_NAME,
        instance_port=APP_PORT,
        instance_host=APP_HOST
    )
    yield
    # On shutdown
    print("Shutting down...")
    await eureka_client.stop_async()

app = FastAPI(
    lifespan=lifespan,
    title="Campaign Service",
    description="Microservice to manage crowdfunding campaigns.",
    version="1.0.0"
)

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"service": "Campaign Service", "status": "running"}

@app.post("/campaigns/", response_model=CampaignRead)
def create_new_campaign(
    campaign_data: CampaignCreate,
    session: Session = Depends(get_session),
    # These headers are expected to be set by the API Gateway after token validation
    x_user_id: str = Header(...),
    x_user_name: str = Header(...)
):
    """
    Create a new campaign.
    """
    if not x_user_id or not x_user_name:
        raise HTTPException(status_code=401, detail="User information missing from headers")

    campaign = campaign_crud.create_campaign(
        session=session,
        campaign_create=campaign_data,
        organizer_id=x_user_id,
        organizer_name=x_user_name
    )
    return campaign

@app.get("/campaigns/", response_model=List[CampaignRead])
def get_campaigns(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """
    Retrieve all campaigns.
    """
    campaigns = campaign_crud.get_all_campaigns(session=session, skip=skip, limit=limit)
    return campaigns

@app.get("/campaigns/{campaign_id}", response_model=CampaignRead)
def get_single_campaign(
    campaign_id: int,
    session: Session = Depends(get_session)
):
    """
    Retrieve a single campaign by its ID.
    """
    campaign = campaign_crud.get_campaign_by_id(session=session, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
