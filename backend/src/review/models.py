from sqlalchemy import Column, String, Integer, DateTime ,ForeignKey, Boolean , Float 
from src.utils.db import Base 
from sqlalchemy.orm import relationship 
from datetime import datetime




class ReviewModel(Base):

    __tablename__ = "reviews"

    id = Column(Integer , primary_key= True)
    user_id = Column(Integer , ForeignKey("user.id") ,nullable= False)
    package_id = Column(Integer , nullable= False)
    rating = Column(Float , nullable = False)
    comment = Column(String)
    created_at = Column(DateTime , default= datetime.utcnow)
 
    user = relationship("UserModel", back_populates="reviews")