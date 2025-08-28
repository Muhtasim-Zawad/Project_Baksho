# models/campaign.py
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
import datetime

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    notification : str
    url : str
    seen : bool = Field(default=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
