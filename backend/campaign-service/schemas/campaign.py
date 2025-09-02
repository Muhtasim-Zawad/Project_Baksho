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

class CampaignUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    goal: Optional[float] = None
    duration: Optional[int] = None
    location: Optional[str] = None
    story: Optional[str] = None
    risks: Optional[str] = None
    timeline: Optional[str] = None
    image_urls: Optional[str] = None

    featured: Optional[bool] = None
    urgent: Optional[bool] = None

    reviewed: Optional[bool] = None
    approved: Optional[bool] = None

    note: Optional[str] = None

    # When updating, we expect a full list of new tiers to replace the old ones.
    incentive_tiers: Optional[List[IncentiveTierCreate]] = None

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
