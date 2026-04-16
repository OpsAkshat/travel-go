from pydantic import BaseModel , ConfigDict
from typing import Optional , List 
from datetime import date , datetime
from src.booking.models import BookingStatusModel

class BookingCreate(BaseModel):

    package_id: int
    travel_date: date
    num_adults: int


class BookingResponse(BaseModel):

    id : int
    user_id : int
    package_id : int
    travel_date : date
    num_adults: int 
    total_price : float 
    status : BookingStatusModel

    class Config: 
        from_attributes = True

