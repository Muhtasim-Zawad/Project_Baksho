# models/campaign.py
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
import datetime

class IncentiveTier(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    title: str
    description: str
    estimated_delivery: Optional[str] = None
    quantity: Optional[int] = None

    campaign_id: int = Field(foreign_key="campaign.id")
    campaign: "Campaign" = Relationship(back_populates="incentive_tiers")

class Campaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    category: str
    goal: float
    duration: int # in days
    location: str
    story: str
    risks: str
    timeline: str

    # Organizer info from user-service/gateway
    organizer_id: str
    organizer_name: str

    raised: float = Field(default=0.0)
    backers: int = Field(default=0)

    # Default values set on creation
    featured: bool = Field(default=False)
    urgent: bool = Field(default=False)

    reviewed: bool = Field(default=False)
    approved: bool = Field(default=False)

    note:str = Field(default=None, nullable=True)

    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # Relationships
    incentive_tiers: List[IncentiveTier] = Relationship(back_populates="campaign", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    # Storing image URLs as a simple string, separated by a comma or another delimiter
    image_urls: str # e.g., "url1.jpg,url2.jpg"
