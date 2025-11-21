from pydantic import BaseModel
from typing import List, Optional
from .image import Image
from .artist import Artist

class Album(BaseModel):
    id_album: str
    name: str
    album_type: str
    total_tracks: Optional[int] = None
    release_date: str
    cover: Image
    genres: Optional[List[str]] = []
    artist: List[Artist]
