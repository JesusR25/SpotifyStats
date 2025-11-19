from pydantic import BaseModel
from typing import Optional, List
from .image import Image

class Artist(BaseModel):
    id: Optional[str] = None   # algunos endpoints no dan id
    name: str
    genres: Optional[List[str]] = None
    uri: Optional[str] = None
    popularity: Optional[int] = None
    followers: Optional[int] = None
    image: Optional[Image] = None
