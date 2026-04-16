from fastapi import APIRouter, Depends , HTTPException , status
from sqlalchemy.orm import Session 
from src.utils.db import get_db 
from src.utils.helpers import is_authenticated
from src.payment import controller 
from src.payment.schemas import CreateOrderSchema , VerifyPaymentSchema 
from src.user.models import UserModel 


payment_routes = APIRouter(prefix="/payment", tags=["Payment"])

@payment_routes.post("/create-order", status_code = status.HTTP_200_OK)
def create_order( body: CreateOrderSchema, user: UserModel = Depends(is_authenticated) ,db: Session = Depends(get_db)):
    return controller.create_order(body, user, db)

@payment_routes.post("/verify")
def verify_payment(body: VerifyPaymentSchema, user: UserModel = Depends(is_authenticated) ,db: Session = Depends(get_db)):
    return controller.verify_payment(body,user,db)

