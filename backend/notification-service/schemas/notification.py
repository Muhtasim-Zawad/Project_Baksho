# schemas/notification.py
from pydantic import BaseModel
from typing import Optional
import datetime

class NotificationBase(BaseModel):
    user_id: str
    notification: str
    url : str

class NotificationCreate(NotificationBase):
    pass

class NotificationRead(NotificationBase):
    id: int
    seen: bool
    created_at: datetime.datetime

class NotificationUpdate(BaseModel):
    seen: Optional[bool] = None
