# db/session.py
from sqlmodel import create_engine, Session, SQLModel

# The 'db_data' directory will be created inside the container
# and mapped to a volume on the host.
DATABASE_URL = "sqlite:///db_data/campaigns.db"

engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
