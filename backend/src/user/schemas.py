from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserSchema(BaseModel):
    model_config = ConfigDict(extra='ignore')
    
    name: str 
    username: str
    password: str 
    email: str

class UserResponse(BaseModel):
    name: str
    username: str
    email: str
    id: int
    msg: Optional[str] = None


class LoginSchema(BaseModel):
    username: str
    password: str


class UserReview(BaseModel):
    id: int
    username: str

    class config:
        from_attributes = True