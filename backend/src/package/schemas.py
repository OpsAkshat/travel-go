from pydantic import BaseModel, ConfigDict
from typing import Optional , List , Any 



class PackageListItem(BaseModel):

    
    id: int
    title: str
    destination: str
    price: float 
    description: str 
    images: list 

    class Config:
        from_attributes = True 


    
class PackageDetail(BaseModel):
    model_config = { "from_attributes" : True}

    id: int
    title: str
    destination: str
    price: float 
    description: str 
    duration: int
    images: list
    itinerary: list
    inclusions: list
    exclusions: list
    category: str

    class config:
        from_attributes = True
