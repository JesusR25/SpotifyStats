from pydantic import BaseModel
from typing import List, Optional
from .artist import Artist
from .album import Album



class Track(BaseModel):
    trackID: str
    name: str
    duration_ms: int
    explicit: bool
    artists: List[Artist]
    disc_number: int
    track_number: int
    album: Optional[Album] = None