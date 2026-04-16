from fastapi import APIRouter , Depends , status 
from sqlalchemy.orm import Session
from src.wishlist import controller 
from src.user.models import UserModel
from src.utils.db import get_db 
from src.utils.helpers import is_authenticated



wishlist_routes = APIRouter(prefix="/wishlist")


@wishlist_routes.post("/{package_id}" , status_code = status.HTTP_200_OK)
def addto_wishlist( db: Session = Depends(get_db) , user : UserModel = Depends(is_authenticated) , package_id = int):
    
    user_id = user.id 
    return controller.addto_wishlist( db , user_id , package_id)


@wishlist_routes.delete("/{package_id}")
def remove_from_wishlist( db: Session = Depends(get_db), user: UserModel = Depends(is_authenticated), package_id = int):
    user_id = user.id
    return controller.remove_from_wishlist( db , user_id, package_id)

@wishlist_routes.get("/")
def get_my_wishlist( db: Session = Depends(get_db),user: UserModel = Depends(is_authenticated) ):
    user_id = user.id
    return controller.get_my_wishlist( db , user_id  )

