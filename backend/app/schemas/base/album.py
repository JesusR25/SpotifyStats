from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING
from .image import Image
from .artist import Artist

if TYPE_CHECKING:
    from .track import Track


class Album(BaseModel):
    id_album: Optional[str] = None
    name: str
    album_type: str
    release_date: str
    image: Optional[Image] = None
    cover: Optional[Image] = None
    total_tracks: Optional[int] = None
    genres: Optional[List[str]] = None
    artists: Optional[List[Artist]] = None


class AlbumTracks(BaseModel):
    tracks: List["Track"]
    total: int
    offset: int
    limit: int
