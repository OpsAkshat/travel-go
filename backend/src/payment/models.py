from sqlalchemy import Column , Integer , String , Float , DateTime , ForeignKey, Enum 
from sqlalchemy import func 
import enum 
from src.utils.db import Base 

class PaymentStatus(str , enum.Enum ):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

class PaymentModel(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index =True)

    booking_id = Column(Integer , ForeignKey("bookings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id") , nullable=False)

    razorpay_order_id = Column(String , unique = True , nullable= False)
    razorpay_payment_id = Column(String , nullable=True)
    razorpay_signature = Column(String, nullable=True)

    amount = Column(Float, nullable = False)
    currency = Column(String , default ="INR")
    status = Column(Enum(PaymentStatus) , default = PaymentStatus.PENDING)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now() )