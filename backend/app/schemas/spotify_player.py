from pydantic import BaseModel
from typing import Optional, List

class Cursors(BaseModel):
    before: Optional[str]
    after: Optional[str]


class Image(BaseModel):
    url: str
    height: int
    width: int


class Artist(BaseModel):
    id: str
    name: str


class Album(BaseModel):
    name: str
    album_type: str
    release_date: str
    cover: Optional[Image]
    artists: List[Artist]


class Track(BaseModel):
    name: str
    popularity: int
    artist: List[Artist]
    duration: int
    explicit: bool
    album: Album


class TrackPlayed(BaseModel):
    track: Track
    played_at: str


class TracksRecentlyPlayed(BaseModel):
    tracks: List[TrackPlayed]
    limit: int
    cursors: Cursors


class Device(BaseModel):
    deviceID: str
    is_active: bool
    is_private_session: bool
    is_restricted: bool
    name: str
    deviceType: str
    volume_percent: int
    supports_volume: bool



