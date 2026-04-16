from fastapi import status , HTTPException
from sqlalchemy.orm import Session 
from src.booking.models import BookingModel
from src.package.models import PackageModel



def book_create(body , db: Session , user_id: int):

        package = db.query(PackageModel).filter(PackageModel.id == body.package_id).first()
        if not package:
                raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail="Package not found")
        
        price = package.price * body.num_adults

        new_booking = BookingModel(
                user_id = user_id,
                package_id = body.package_id,
                total_price = price,
                travel_date = body.travel_date,
                num_adults = body.num_adults,
                status = "pending",

        )

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return new_booking 



def get_bookings(db: Session, user_id: int):
        bookings = db.query(BookingModel).filter(BookingModel.user_id == user_id).all()
        return bookings 