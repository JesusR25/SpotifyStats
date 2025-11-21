from pydantic import BaseModel
from typing import List, Optional
from .image import Image

class Artist(BaseModel):
    id: str
    name: str
    genres: Optional[List[str]] = None
    uri: Optional[str] = None
    popularity: Optional[int] = None
    followers: Optional[int] = None
    image: Optional[Image] = None
