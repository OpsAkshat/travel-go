from fastapi import APIRouter,  Depends, status
from sqlalchemy.orm import Session
from src.booking import controller
from src.utils.db import get_db
from src.booking.schemas import BookingCreate , BookingResponse
from src.user.models import UserModel 
from src.utils.helpers import is_authenticated 
from typing import List


booking_routes = APIRouter(prefix = "/bookings")

@booking_routes.post("/", response_model = BookingResponse , status_code= status.HTTP_201_CREATED)
def create_booking(body: BookingCreate , db: Session = Depends(get_db),  user : UserModel = Depends(is_authenticated)):
    user_id = user.id
    return controller.book_create(body , db, user_id)


@booking_routes.get("/", response_model= List[BookingResponse], status_code=status.HTTP_200_OK)
def get_bookings(db:Session = Depends(get_db), user: UserModel = Depends(is_authenticated) ):
    user_id = user.id
    return controller.get_bookings(db, user_id)