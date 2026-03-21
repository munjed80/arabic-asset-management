import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AssetStatus(str, enum.Enum):
    in_stock = "in_stock"
    active = "active"
    assigned = "assigned"
    under_maintenance = "under_maintenance"
    damaged = "damaged"
    lost = "lost"
    retired = "retired"


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    asset_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    serial_number: Mapped[str | None] = mapped_column(String(150), unique=True)
    brand: Mapped[str | None] = mapped_column(String(150))
    asset_model: Mapped[str | None] = mapped_column(String(150), name="model")
    status: Mapped[AssetStatus] = mapped_column(Enum(AssetStatus), default=AssetStatus.in_stock)
    acquisition_date: Mapped[date | None] = mapped_column(Date)
    purchase_cost: Mapped[float | None] = mapped_column(Numeric(12, 2))
    warranty_end: Mapped[date | None] = mapped_column(Date)
    supplier: Mapped[str | None] = mapped_column(String(255))
    notes: Mapped[str | None] = mapped_column(String(2000))

    category_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"))
    location_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("locations.id"))
    department_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departments.id"))
    assigned_to_user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
