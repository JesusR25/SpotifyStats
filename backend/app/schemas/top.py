from pydantic import BaseModel
from typing import List
from .base.track import Track
from .base.artist import Artist


class TopTracks(BaseModel):
    tracks: List[Track]
    limit: int
    offset: int
    total: int


class TopArtist(BaseModel):
    artists: List[Artist]
    limit: int
    offset: int
    total: int
