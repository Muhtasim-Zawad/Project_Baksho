# crud/campaign.py
from sqlmodel import Session, select
from models.campaign import Campaign, IncentiveTier
from schemas.campaign import CampaignCreate, CampaignUpdate

def create_campaign(session: Session, campaign_create: CampaignCreate, organizer_id: str, organizer_name: str) -> Campaign:
    # extract tehe incentive tier data the payload
    incentive_tiers_data = campaign_create.incentive_tiers

    # 2. create a dictionary for the main campaign data, excluding the tiers
    campaign_data = campaign_create.model_dump(exclude={"incentive_tiers"})

    # 3. create the main Campaign object
    campaign = Campaign(
        **campaign_data,
        organizer_id=organizer_id,
        organizer_name=organizer_name
    )

    # 4. manually create IncentiveTier model instances and link them to the campaign
    for tier_data in incentive_tiers_data:
        tier = IncentiveTier(
            **tier_data.model_dump(),
            campaign=campaign  # this links the tier to the parent campaign
        )
        ## note: we don't need to call session.add(tier) here
        # Thanks to SQLAlchemy's relationship configuration, tier objects
        # are automatically added to the session with the parent campaign

    # 5. add the campaign (with its linked tiers) to the session and commit
    session.add(campaign)
    session.commit()
    session.refresh(campaign)

    return campaign

def get_campaign_by_id(session: Session, campaign_id: int) -> Campaign | None:
    statement = select(Campaign).where(Campaign.id == campaign_id)
    campaign = session.exec(statement).first()
    return campaign

def get_all_approved_campaigns(session: Session, skip: int = 0, limit: int = 100) -> list[Campaign]:
    """
    Retrieves a list of approved campaigns with pagination.
    """
    statement = select(Campaign).where(Campaign.approved == True).offset(skip).limit(limit)
    campaigns = session.exec(statement).all()
    return campaigns

def get_all_campaigns(session: Session, skip: int = 0, limit: int = 100) -> list[Campaign]:
    """
    Retrieves a list of approved campaigns with pagination.
    """
    statement = select(Campaign).offset(skip).limit(limit)
    campaigns = session.exec(statement).all()
    return campaigns

def update_campaign(session: Session, campaign: Campaign, campaign_update: CampaignUpdate) -> Campaign:
    # Get the update data, excluding unset fields to avoid overwriting with None
    update_data = campaign_update.model_dump(exclude_unset=True)

    # Handle incentive tiers separately
    if "incentive_tiers" in update_data:
        # Clear existing tiers
        campaign.incentive_tiers.clear()
        # Create and add new tiers
        new_tiers_data = update_data.pop("incentive_tiers")
        for tier_data in new_tiers_data:
            tier = IncentiveTier(**tier_data, campaign=campaign)
            campaign.incentive_tiers.append(tier)
            # No need to session.add(tier) due to the relationship cascade

    # Update the remaining campaign fields
    for key, value in update_data.items():
        setattr(campaign, key, value)

    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    return campaign

def delete_campaign(session: Session, campaign: Campaign) -> None:
    session.delete(campaign)
    session.commit()
    return
