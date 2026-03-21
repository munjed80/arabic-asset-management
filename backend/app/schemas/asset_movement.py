from datetime import datetime

from pydantic import BaseModel

from app.models.asset_movement import MovementType


class AssetMovementBase(BaseModel):
    asset_id: int
    movement_type: MovementType
    from_location_id: int | None = None
    to_location_id: int | None = None
    from_department_id: int | None = None
    to_department_id: int | None = None
    from_user_id: int | None = None
    to_user_id: int | None = None
    reason: str | None = None
    notes: str | None = None
    created_by: int | None = None


class AssetMovementCreate(AssetMovementBase):
    pass


class AssetMovementRead(AssetMovementBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
