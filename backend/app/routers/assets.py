from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset, AssetStatus
from app.schemas.asset import AssetCreate, AssetRead, AssetUpdate

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetRead])
def list_assets(
    skip: int = 0,
    limit: int = 50,
    search: str | None = Query(default=None, description="Search by name or asset code"),
    db: Session = Depends(get_db),
):
    query = db.query(Asset)
    if search:
        term = f"%{search}%"
        query = query.filter(
            Asset.name.ilike(term) | Asset.asset_code.ilike(term)
        )
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=AssetRead, status_code=status.HTTP_201_CREATED)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)):
    existing = db.query(Asset).filter(Asset.asset_code == payload.asset_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Asset code already exists")
    asset = Asset(**payload.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/{asset_id}", response_model=AssetRead)
def get_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.patch("/{asset_id}", response_model=AssetRead)
def update_asset(asset_id: int, payload: AssetUpdate, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(asset, field, value)
    db.commit()
    db.refresh(asset)
    return asset


@router.patch("/{asset_id}/retire", response_model=AssetRead)
def retire_asset(asset_id: int, db: Session = Depends(get_db)):
    """Mark an asset as retired instead of deleting it."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    asset.status = AssetStatus.retired
    db.commit()
    db.refresh(asset)
    return asset
