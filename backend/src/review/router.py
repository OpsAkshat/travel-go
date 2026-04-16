from fastapi import APIRouter, Depends, status 
from sqlalchemy.orm import Session 
from src.review import controller
from src.utils.db import get_db 
from src.review.schemas import ReviewCreate, ReviewResponse 
from src.utils.helpers import is_authenticated 
from src.user.models import UserModel 


review_routes =APIRouter(prefix="/reviews")

@review_routes.post("/", response_model = ReviewResponse ,status_code= status.HTTP_201_CREATED) 
def create_review(body: ReviewCreate, db: Session = Depends(get_db), user : UserModel = Depends(is_authenticated)):

    user_id = user.id
    return controller.create_review(body, db , user_id)

@review_routes.get("/{package_id}/", response_model = list[ReviewResponse] , status_code= status.HTTP_200_OK)
def get_reviews( db: Session = Depends(get_db) , package_id = int): 
    return controller.get_reviews(db, package_id)


@review_routes.get("/{user_id}" , response_model = list[ReviewResponse] ,status_code = status.HTTP_200_OK )
def my_reviews( db: Session = Depends(get_db), user : UserModel = Depends(is_authenticated)):
    user_id = user.id 
    return controller.my_reviews( db , user_id)

@review_routes.delete("/", status_code = status.HTTP_200_OK)
def delete_review( db: Session = Depends(get_db), package_id = int , user : UserModel = Depends(is_authenticated)):
    user_id = user.id
    return controller.delete_review( db, package_id, user_id) 