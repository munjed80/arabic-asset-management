import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AssetStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    under_maintenance = "under_maintenance"
    disposed = "disposed"


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    asset_tag: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000))
    serial_number: Mapped[str | None] = mapped_column(String(150), unique=True)
    status: Mapped[AssetStatus] = mapped_column(Enum(AssetStatus), default=AssetStatus.active)
    purchase_date: Mapped[date | None] = mapped_column(Date)
    purchase_cost: Mapped[float | None] = mapped_column(Numeric(12, 2))

    category_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"))
    location_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("locations.id"))
    department_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departments.id"))
    assigned_to_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
