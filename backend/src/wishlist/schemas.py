from pydantic import BaseModel
from src.wishlist.models import WishlistModel


class wishlist(BaseModel):
    id : int
    user_id : int
    package_id : int

    