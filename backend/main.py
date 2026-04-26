from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.db import Base, engine 
from src.user.router import user_routes
from src.package.router import package_routes
from src.booking.router import booking_routes
from src.review.router import review_routes
from src.wishlist.router import wishlist_routes
from src.wishlist import models 
from src.payment.router import payment_routes

Base.metadata.create_all(engine) 

import os

# ROOT_PREFIX allows the app to be served under /api in production (behind ingress)
# while still working at / during local development.
ROOT_PREFIX = os.getenv("ROOT_PREFIX", "")

app = FastAPI(title="This is My travel Website",root_path=ROOT_PREFIX)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes)
app.include_router(package_routes)
app.include_router(booking_routes)
app.include_router(review_routes)
app.include_router(wishlist_routes)
app.include_router(payment_routes)

