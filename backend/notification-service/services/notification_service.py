# services/notification_service.py
from sqlmodel import Session, select
from models.notification import Notification
from schemas.notification import NotificationCreate, NotificationUpdate
from typing import List

def create_notification(session: Session, notification_in: NotificationCreate) -> Notification:
    notification = Notification.from_orm(notification_in)
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification

def get_notifications_by_user(session: Session, user_id: str) -> List[Notification]:
    statement = select(Notification).where(Notification.user_id == user_id)
    results = session.exec(statement)
    return results.all()

def get_notification(session: Session, notification_id: int) -> Notification | None:
    return session.get(Notification, notification_id)

def update_notification(session: Session, notification_id: int, notification_in: NotificationUpdate) -> Notification | None:
    notification = session.get(Notification, notification_id)
    if notification:
        if notification_in.seen is not None:
            notification.seen = notification_in.seen
        session.add(notification)
        session.commit()
        session.refresh(notification)
    return notification

def delete_notification(session: Session, notification_id: int) -> bool:
    notification = session.get(Notification, notification_id)
    if notification:
        session.delete(notification)
        session.commit()
        return True
    return False
