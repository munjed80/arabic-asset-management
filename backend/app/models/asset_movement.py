import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class MovementType(str, enum.Enum):
    assign = "assign"
    transfer = "transfer"
    send_to_maintenance = "send_to_maintenance"
    return_from_maintenance = "return_from_maintenance"
    mark_lost = "mark_lost"
    mark_damaged = "mark_damaged"


class AssetMovement(Base):
    __tablename__ = "asset_movements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False, index=True)
    movement_type: Mapped[MovementType] = mapped_column(Enum(MovementType), nullable=False)

    from_location_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("locations.id"))
    to_location_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("locations.id"))
    from_department_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departments.id"))
    to_department_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departments.id"))
    from_user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    to_user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))

    reason: Mapped[str | None] = mapped_column(String(500))
    notes: Mapped[str | None] = mapped_column(String(2000))
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
