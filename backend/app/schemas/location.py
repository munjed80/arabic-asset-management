from pydantic import BaseModel


class LocationBase(BaseModel):
    name: str
    address: str | None = None


class LocationCreate(LocationBase):
    pass


class LocationRead(LocationBase):
    id: int

    model_config = {"from_attributes": True}
