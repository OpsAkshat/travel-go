from fastapi import APIRouter , Depends, status , Request
from sqlalchemy.orm import Session 
from src.user.schemas import UserSchema
from src.utils.db import get_db 
from src.user import controller 
from src.user.schemas import UserResponse
from src.user.schemas import LoginSchema 

user_routes= APIRouter(prefix="/user")


@user_routes.post("/register2", response_model = UserResponse , status_code=status.HTTP_201_CREATED)
def register(body: UserSchema, db: Session = Depends(get_db)):
    print(UserSchema)
    return controller.register(body, db )


@user_routes.post("/login", status_code= status.HTTP_200_OK)
def login(body:LoginSchema , db: Session = Depends(get_db)):
    return controller.login_user(body, db)

@user_routes.get("/auth",response_model= UserResponse,status_code= status.HTTP_200_OK)
def is_auth(request:Request, db:Session = Depends(get_db)):
    return controller.is_authenticated(request, db)