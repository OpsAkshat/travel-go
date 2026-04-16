from sqlalchemy import Column , Integer ,ForeignKey , UniqueConstraint
from src.utils.db import Base
from sqlalchemy.orm import relationship

class WishlistModel(Base):

    __tablename__ = "wishlist"

    id = Column( Integer , primary_key = True )
    user_id = Column( Integer ,ForeignKey("user.id") , nullable = False)
    package_id = Column( Integer, ForeignKey("packages.id") , nullable= False)


    package = relationship("PackageModel" , back_populates= "wishlist")

