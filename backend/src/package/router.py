from typing import List
from fastapi import APIRouter , Depends, status , Request 
from sqlalchemy.orm import Session 
from src.package import controller 
from src.utils.db import get_db
from src.package.schemas import PackageDetail , PackageListItem


package_routes = APIRouter(prefix="/packages")

@package_routes.get("/{package_id}", response_model = PackageDetail ,status_code= status.HTTP_200_OK)
def get_package(package_id: int , db: Session = Depends(get_db)):
    return controller.get_package(package_id , db)


@package_routes.get("/",response_model = List[PackageDetail], status_code = status.HTTP_200_OK)
def get_packages(db: Session = Depends(get_db), min_price: float = None, max_price: float = None , duration: int = None, category: str = None ):
    return controller.get_packages(db, min_price, max_price, duration, category)

@package_routes.post("", status_code= status.HTTP_201_CREATED)
def create_package(body: PackageDetail , db: Session = Depends(get_db)):
    return controller.create_package(body,db) 