from sqlalchemy import Column, String ,Integer ,DateTime , Boolean ,Float, JSON 
from src.utils.db import Base
from sqlalchemy.orm import relationship


class PackageModel(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True)
    title= Column(String, nullable= False)
    description = Column(String , nullable= False)
    destination = Column(String, nullable= False)
    price = Column(Float, nullable= False)
    duration = Column(Integer, nullable= False)  
    images= Column(JSON, default= list) 
    itinerary = Column(JSON , default= list)
    inclusions = Column(JSON , default= list)
    exclusions = Column(JSON , default= list)
    category = Column(String(100), nullable= False)
    rating_avg = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    wishlist = relationship("WishlistModel" , back_populates="package") 