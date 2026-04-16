from pydantic import BaseModel
from src.review.models import ReviewModel
from datetime import datetime
from  src.user.schemas import UserReview  
from typing import Optional 




class ReviewCreate(BaseModel): 
    
    package_id : int
    rating : float
    comment : str
    


class ReviewResponse(BaseModel):

    id : int
    user_id : int
    package_id : int 
    user : UserReview
    rating : float
    comment : Optional[str]
    created_at : Optional[datetime]

    class Config:
        from_attributes = True


