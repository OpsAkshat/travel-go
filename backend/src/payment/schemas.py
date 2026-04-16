from pydantic import BaseModel 
from enum import Enum 

class PaymentStatus(str , Enum): 
    PENDING = "pending" 
    SUCCESS = "success"
    FAILED = "failed"

class CreateOrderSchema(BaseModel):
    booking_id : int


class OrderResponseSchema(BaseModel):
    razorpay_order_id : str
    amount : float
    amount_in_paise : int
    currency: str
    key_id : str


class VerifyPaymentSchema(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentResultSchema(BaseModel):
    success : bool
    message: str
    payment_id: int | None = None