import razorpay  
import hmac 
import hashlib
from fastapi import HTTPException
from sqlalchemy.orm import Session 
from src.utils.settings import settings 
from src.payment.models import PaymentModel , PaymentStatus 
from src.payment.schemas import CreateOrderSchema , OrderResponseSchema , VerifyPaymentSchema , PaymentResultSchema 
from src.booking.models import BookingModel 
from src.user.models import UserModel 

razorpay_client = razorpay.Client(auth =(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_order(body: CreateOrderSchema , user: UserModel, db: Session):
    # Expecting user to be the UserModel object returned by is_authenticated
    user_id = user.id

    booking = db.query(BookingModel).filter(
        BookingModel.id == body.booking_id ,
        BookingModel.user_id == user_id
    ).first() 

    # For testing, mock the amount if booking not explicitly found in DB yet
    if not booking:
        amount_in_paise = int(1300 * 100)
    else:
        amount_in_paise = int(booking.total_price * 100) 

    razorpay_order = razorpay_client.order.create({
        "amount": amount_in_paise,
        "currency": "INR",
        "receipt": f"booking_{body.booking_id}" ,
        "payment_capture": 1
    })

    payment = PaymentModel(
        booking_id = body.booking_id, 
        user_id = user_id,
        razorpay_order_id = razorpay_order["id"],
        amount =  1300 if not booking else booking.total_price,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "razorpay_order_id": razorpay_order["id"],
        "amount": 1300 if not booking else booking.total_price, 
        "amount_in_paise": amount_in_paise,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID
    }


def verify_payment(body: VerifyPaymentSchema , user: UserModel , db: Session):
    user_id = user.id

    payment = db.query(PaymentModel).filter(
        PaymentModel.razorpay_order_id == body.razorpay_order_id, 
        PaymentModel.user_id == user_id
    ).first()

    if not payment: 
        raise HTTPException(status_code =404, detail="Payment record not found")
    
    payload_str = f"{body.razorpay_order_id}|{body.razorpay_payment_id}"

    expected_signature = hmac.new(
        key=settings.RAZORPAY_KEY_SECRET.encode(),
        msg=payload_str.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()

    if expected_signature != body.razorpay_signature:
        payment.status = PaymentStatus.FAILED
        db.commit()
        raise HTTPException(status_code=400, detail="payment verification failed")
    
    payment.razorpay_payment_id = body.razorpay_payment_id
    payment.razorpay_signature = body.razorpay_signature
    payment.status = PaymentStatus.SUCCESS 

    booking = db.query(BookingModel).filter(
        BookingModel.id == payment.booking_id
    ).first()
    if booking: 
        booking.status = "confirmed" 

    db.commit()

    return {
        "success": True, 
        "message": "Payment verified successfully",
        "payment_id": payment.id
    } 