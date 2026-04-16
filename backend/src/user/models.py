from sqlalchemy import Column, String, Integer , DateTime, Boolean, PrimaryKeyConstraint
from src.utils.db import Base 
from sqlalchemy.orm import relationship 


class UserModel(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    hash_password = Column(String, nullable=False)
    email = Column(String)

    reviews = relationship("ReviewModel" , back_populates= "user")

