from sqlalchemy import Column, String, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

user_badge = Table(
    'user_badge',
    Base.metadata,
    Column('user_id', String, ForeignKey('user.id'), primary_key=True),
    Column('badge_id', String, ForeignKey('badge.id'), primary_key=True),
    Column('awarded_at', DateTime, default=datetime.utcnow)
)

class Badge(Base):
    __tablename__ = "badge"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    icon = Column(String)
    
    users = relationship("User", secondary=user_badge, back_populates="badges")
