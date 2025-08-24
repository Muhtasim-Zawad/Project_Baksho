# crud/campaign.py
from sqlmodel import Session, select
from models.campaign import Campaign, IncentiveTier # <-- Import IncentiveTier
from schemas.campaign import CampaignCreate

def create_campaign(session: Session, campaign_create: CampaignCreate, organizer_id: str, organizer_name: str) -> Campaign:
    # 1. Extract the incentive tier data from the request payload
    incentive_tiers_data = campaign_create.incentive_tiers

    # 2. Create a dictionary for the main campaign data, excluding the tiers
    campaign_data = campaign_create.model_dump(exclude={"incentive_tiers"})

    # 3. Create the main Campaign object
    campaign = Campaign(
        **campaign_data,
        organizer_id=organizer_id,
        organizer_name=organizer_name
    )

    # 4. Manually create IncentiveTier model instances and link them to the campaign
    for tier_data in incentive_tiers_data:
        tier = IncentiveTier(
            **tier_data.model_dump(),
            campaign=campaign  # This links the tier to the parent campaign
        )
        # SQLAlchemy will automatically handle adding this to the session
        # when the parent `campaign` is added, thanks to the relationship setup.

    # 5. Add the campaign (with its linked tiers) to the session and commit
    session.add(campaign)
    session.commit()
    session.refresh(campaign)

    return campaign

def get_campaign_by_id(session: Session, campaign_id: int) -> Campaign | None:
    statement = select(Campaign).where(Campaign.id == campaign_id)
    campaign = session.exec(statement).first()
    return campaign

def get_all_campaigns(session: Session, skip: int = 0, limit: int = 100) -> list[Campaign]:
    statement = select(Campaign).offset(skip).limit(limit)
    campaigns = session.exec(statement).all()
    return campaigns
