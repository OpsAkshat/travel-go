from fastapi import HTTPException , status 
from sqlalchemy.orm import Session
from src.review.schemas import  ReviewCreate , ReviewResponse 
from src.review.models import ReviewModel
from src.package.models import PackageModel
 


def create_review(body , db: Session ,user_id: int): 

    query = db.query(PackageModel).filter(PackageModel.id == body.package_id).first()
    if not query:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail="Package not found")

    existing = db.query(ReviewModel).filter(ReviewModel.user_id == user_id, ReviewModel.package_id == body.package_id).first()
    if existing:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail="You have already reviewed this package")
    

    review = ReviewModel( 
        user_id = user_id,
        package_id = body.package_id,
        rating= body.rating,
        comment = body.comment
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    


    count = db.query(ReviewModel).filter(ReviewModel.package_id == body.package_id).count()
    new_rating = (query.rating_avg * (count - 1) + body.rating) / count
    query.rating_avg = round(new_rating, 2)
    query.review_count = count   
    db.commit()

    return review


def get_reviews(db: Session , package_id: int):

    query = db.query(ReviewModel).filter(ReviewModel.package_id == package_id).all()
    if not query:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail="No reviews for this package")
    return query 


def my_reviews(db: Session ,user_id : int):

    reviews = db.query(ReviewModel).filter(ReviewModel.user_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail= "you have not reviewd any package yet")

    return reviews


def delete_review(db: Session , package_id: int, user_id: int):

    review = db.query(ReviewModel).filter(ReviewModel.package_id == package_id, ReviewModel.user_id == user_id).first()
    if not review:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Review not found")
    
    if review.user_id != user_id:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = " You can only delete your own reviews")
    
    db.delete(review)
    db.commit()
    db.refresh(review)
    return {"msg": "Review deleted successfully"}
