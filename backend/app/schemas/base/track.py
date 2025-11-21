from pydantic import BaseModel
from typing import List
from .artist import Artist



class Track(BaseModel):
    trackID: str
    name: str
    duration_ms: int
    explicit: bool
    artists: List[Artist]
    disc_number: int
    track_number: int