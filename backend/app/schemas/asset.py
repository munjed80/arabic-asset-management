from datetime import date
from pydantic import BaseModel


class AssetBase(BaseModel):
    asset_tag: str
    name: str
    description: str | None = None
    serial_number: str | None = None
    status: str = "active"
    purchase_date: date | None = None
    purchase_cost: float | None = None
    category_id: int | None = None
    location_id: int | None = None
    department_id: int | None = None
    assigned_to_id: int | None = None


class AssetCreate(AssetBase):
    pass


class AssetRead(AssetBase):
    id: int

    model_config = {"from_attributes": True}


class AssetUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: str | None = None
    location_id: int | None = None
    department_id: int | None = None
    assigned_to_id: int | None = None
