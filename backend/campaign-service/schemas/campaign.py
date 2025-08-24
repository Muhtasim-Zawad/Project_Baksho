# schemas/campaign.py
from typing import List, Optional
from sqlmodel import SQLModel

# Schema for creating an incentive tier (part of campaign creation)
class IncentiveTierCreate(SQLModel):
    amount: float
    title: str
    description: str
    estimated_delivery: Optional[str] = None
    quantity: Optional[int] = None

# Schema for creating a campaign
class CampaignCreate(SQLModel):
    title: str
    description: str
    category: str
    goal: float
    duration: int
    location: str
    story: str
    risks: str
    timeline: str
    image_urls: str # Comma-separated list of URLs
    incentive_tiers: List[IncentiveTierCreate] = []

# Schema for reading an incentive tier (part of campaign response)
class IncentiveTierRead(IncentiveTierCreate):
    id: int

# Schema for the response model when reading a campaign
class CampaignRead(CampaignCreate):
    id: int
    organizer_id: str
    organizer_name: str
    raised: float
    backers: int
    featured: bool
    urgent: bool
    incentive_tiers: List[IncentiveTierRead] = []
