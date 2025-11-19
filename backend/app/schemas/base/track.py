from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from .artist import Artist
    from .album import Album


class Track(BaseModel):
    trackID: Optional[str] = None
    name: str
    popularity: Optional[int] = None
    artists: Optional[List["Artist"]] = None
    artist: Optional[List["Artist"]] = None
    duration_ms: Optional[int] = None
    duration: Optional[int] = None
    explicit: bool
    disc_number: Optional[int] = None
    track_number: Optional[int] = None
    album: Optional["Album"] = None
