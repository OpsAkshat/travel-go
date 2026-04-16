from src.user.schemas import UserSchema, UserResponse
from sqlalchemy.orm import Session
from src.user.models import UserModel
from fastapi import HTTPException, status , Request
from pwdlib import PasswordHash
from src.user.schemas import LoginSchema 
import jwt
from src.utils.settings import settings
from datetime import datetime , timedelta
from pwdlib import PasswordHash 


password_hash = PasswordHash.recommended()




def get_password_hash(password: str) -> str:
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return password_hash.verify(plain_password, hashed_password)

def register(body: UserSchema , db: Session):
    is_user = db.query(UserModel).filter(UserModel.username == body.username).first()
    if is_user:
        raise HTTPException(400,detail="Username already exists") 
    
    is_user = db.query(UserModel).filter(UserModel.email == body.email).first()
    if is_user:
        raise HTTPException(400,detail="email already exists") 
    
    hash_password = get_password_hash(body.password) 

    new_user = UserModel(
        name = body.name, 
        username = body.username, 
        hash_password = hash_password,
        email = body.email,
       
    ) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(id=new_user.id, name=new_user.name, username=new_user.username, email=new_user.email, msg="Successful registeration!")


def login_user(body: LoginSchema , db: Session): 
    user = db.query(UserModel).filter(UserModel.username == body.username).first()
    if not user:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED,detail="You Entered wrong username")
    
    if not verify_password(body.password , user.hash_password):
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED,detail="You Entered wrong password")
 

    exp_time = datetime.now() + timedelta(minutes=settings.EXP_TIME) 

    token = jwt.encode({"_id": user.id, "exp": exp_time}, settings.SECRET_KEY, settings.ALGORITHM)
    
    
    return {"access_token":token}


def is_authenticated(request:Request , db: Session):
    token = request.headers.get("authorization")
    if not token:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="token missing")
    try:
        token = token.split(" ")[1]

        data = jwt.decode(token, settings.SECRET_KEY , algorithms=[settings.ALGORITHM])
        user_id = data.get("_id")
        exp_time = data.get("exp")

        current_time = datetime.now().timestamp()
        if current_time > exp_time:
            raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="token expired")
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user: 
            raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="invalid token")
        
        return user
    except Exception as e:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="invalid token")
    