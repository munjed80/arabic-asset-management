from datetime import date, datetime

from pydantic import BaseModel

from app.models.asset import AssetStatus


class AssetBase(BaseModel):
    asset_code: str
    name: str
    serial_number: str | None = None
    brand: str | None = None
    asset_model: str | None = None
    status: AssetStatus = AssetStatus.in_stock
    acquisition_date: date | None = None
    purchase_cost: float | None = None
    warranty_end: date | None = None
    supplier: str | None = None
    notes: str | None = None
    category_id: int | None = None
    location_id: int | None = None
    department_id: int | None = None
    assigned_to_user_id: int | None = None


class AssetCreate(AssetBase):
    pass


class AssetRead(AssetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AssetUpdate(BaseModel):
    name: str | None = None
    serial_number: str | None = None
    brand: str | None = None
    asset_model: str | None = None
    status: AssetStatus | None = None
    acquisition_date: date | None = None
    purchase_cost: float | None = None
    warranty_end: date | None = None
    supplier: str | None = None
    notes: str | None = None
    category_id: int | None = None
    location_id: int | None = None
    department_id: int | None = None
    assigned_to_user_id: int | None = None
