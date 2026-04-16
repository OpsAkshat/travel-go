from fastapi import  HTTPException , status
from sqlalchemy.orm import Session 
from src.wishlist.schemas import wishlist 
from src.wishlist.models import WishlistModel 
from src.package.models import PackageModel


def addto_wishlist(db: Session , user_id : int, package_id : int): 

    package = db.query(PackageModel).filter(PackageModel.id == package_id).first()
    if not package:
        raise HTTPException(status_code= 404, detail="Package not found")
    
    existing = db.query(WishlistModel).filter(WishlistModel.user_id == user_id , WishlistModel.package_id == package_id).first()

    if existing :
        raise HTTPException(status_code =400, detail="Package already in wishlist") 
    

    item = WishlistModel(
        user_id = user_id, 
        package_id = package_id
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def remove_from_wishlist( db: Session , user_id , package_id):
    item = db.query(WishlistModel).filter(WishlistModel.user_id == user_id , WishlistModel.package_id == package_id).first()
    if not item:
        raise HTTPException(status_code = 404 , detail = "Item not found in wishlist" )
    
    db.delete(item)
    db.commit()

    return { "msg": "Item successfully removed "}


def get_my_wishlist(db: Session , user_id : int):
    return db.query(WishlistModel).filter(WishlistModel.user_id == user_id ).all()
