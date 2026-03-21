from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset, AssetStatus
from app.models.asset_movement import AssetMovement, MovementType
from app.schemas.asset_movement import AssetMovementCreate, AssetMovementRead

router = APIRouter(prefix="/movements", tags=["movements"])


def _apply_movement_to_asset(asset: Asset, movement_type: MovementType, payload: AssetMovementCreate) -> None:
    """Update the asset fields based on movement type."""
    if movement_type == MovementType.assign:
        if payload.to_user_id is not None:
            asset.assigned_to_user_id = payload.to_user_id
        asset.status = AssetStatus.assigned

    elif movement_type == MovementType.transfer:
        if payload.to_location_id is not None:
            asset.location_id = payload.to_location_id
        if payload.to_department_id is not None:
            asset.department_id = payload.to_department_id

    elif movement_type == MovementType.send_to_maintenance:
        asset.status = AssetStatus.under_maintenance

    elif movement_type == MovementType.return_from_maintenance:
        asset.status = AssetStatus.active

    elif movement_type == MovementType.mark_lost:
        asset.status = AssetStatus.lost

    elif movement_type == MovementType.mark_damaged:
        asset.status = AssetStatus.damaged


@router.get("", response_model=list[AssetMovementRead])
def list_movements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return (
        db.query(AssetMovement)
        .order_by(AssetMovement.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("", response_model=AssetMovementRead, status_code=status.HTTP_201_CREATED)
def create_movement(payload: AssetMovementCreate, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == payload.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Apply business logic to asset before persisting the movement record
    _apply_movement_to_asset(asset, payload.movement_type, payload)

    movement = AssetMovement(**payload.model_dump())
    db.add(movement)

    db.commit()
    db.refresh(movement)
    return movement


@router.get("/asset/{asset_id}", response_model=list[AssetMovementRead])
def list_movements_for_asset(
    asset_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    if not db.query(Asset.id).filter(Asset.id == asset_id).first():
        raise HTTPException(status_code=404, detail="Asset not found")
    return (
        db.query(AssetMovement)
        .filter(AssetMovement.asset_id == asset_id)
        .order_by(AssetMovement.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
