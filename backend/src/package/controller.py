from fastapi import HTTPException , status 
from src.package.schemas import PackageListItem , PackageDetail 
from src.utils.settings import settings 
from sqlalchemy.orm import Session 
from src.package.models import PackageModel 
from sqlalchemy import func



def get_package(package_id: int ,db: Session):
    package = db.query(PackageModel).filter(PackageModel.id == package_id ).first()
    if not package:
        raise HTTPException (status_code = status.HTTP_404_NOT_FOUND, detail = "Package not found")
    
    return package


def get_packages(db: Session, min_price: float = None, max_price: float = None, duration: int = None, category: str = None):
    

    
    
    query = db.query(PackageModel)
    if min_price is not None:
        query = query.filter(PackageModel.price >= min_price)

    if max_price is not None:
        query = query.filter(PackageModel.price <= max_price)

    if duration is not None:
        query = query.filter(PackageModel.duration == duration)

    if category and category.strip():
        query = query.filter(func.trim(func.lower(PackageModel.category) == category.strip().lower()))

    

    packages = query.all()
    return packages 
    


def create_package(body, db:Session):

    new_package = PackageModel(
        title=body.title, 
        description=body.description, 
        price=body.price, 
        destination=body.destination,
        duration=body.duration, 
        images=body.images, 
        itinerary=body.itinerary, 
        inclusions=body.inclusions, 
        exclusions=body.exclusions, 
        category=body.category,
        )
    

    db.add(new_package)
    db.commit()
    db.refresh(new_package)

    return new_package