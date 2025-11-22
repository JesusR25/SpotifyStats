from pydantic import BaseModel
from .image import Image

class User(BaseModel):
    userID: str
    email: str
    display_name: str
    country: str
    followers: int
    product: str
    images: Image