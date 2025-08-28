# api/notifications.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from db.database import get_session
from schemas.notification import NotificationCreate, NotificationRead, NotificationUpdate
from services import notification_service

router = APIRouter()

@router.post("/", response_model=NotificationRead)
def create_notification(notification: NotificationCreate, session: Session = Depends(get_session)):
    return notification_service.create_notification(session=session, notification_in=notification)

@router.get("/{user_id}", response_model=List[NotificationRead])
def get_notifications_for_user(user_id: str, session: Session = Depends(get_session)):
    return notification_service.get_notifications_by_user(session=session, user_id=user_id)

@router.put("/{notification_id}", response_model=NotificationRead)
def update_notification(notification_id: int, notification: NotificationUpdate, session: Session = Depends(get_session)):
    db_notification = notification_service.update_notification(session=session, notification_id=notification_id, notification_in=notification)
    if db_notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notification

@router.delete("/{notification_id}", status_code=204)
def delete_notification(notification_id: int, session: Session = Depends(get_session)):
    deleted = notification_service.delete_notification(session=session, notification_id=notification_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"ok": True}
