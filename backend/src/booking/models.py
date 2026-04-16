from sqlalchemy import Column , String, Integer, Float, Date, Boolean,Enum, ForeignKey
from src.utils.db import Base 
import enum




class BookingStatusModel(str , enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"



class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key = True)
    user_id = Column(Integer , ForeignKey("user.id") ,nullable = False)
    package_id= Column(Integer , ForeignKey("packages.id"),nullable = False)
    travel_date = Column(Date, nullable= False)
    num_adults = Column(Integer , nullable =False)
    total_price = Column(Float , nullable = False)
    status = Column(Enum(BookingStatusModel), default = BookingStatusModel.pending)
    
