from pydantic import BaseModel
from typing import List, Optional


class Image(BaseModel):
    url: str
    height: int
    width: int

class Artist(BaseModel):
    id: str
    name: str

class Album(BaseModel):
    id_album: str
    name: str
    album_type: str
    total_tracks: int
    release_date: str
    image: Image
    genres: List[str]
    artist: List[Artist]


class AlbumSaved(BaseModel):
    added_at: str
    album: Album


class SavedAlbumsByUser(BaseModel):
    AlbumsSaved: List[AlbumSaved]
    limit: int
    offset: int
    total: int


class Track(BaseModel):
    trackID: str
    name: str
    duration_ms: int
    explicit: bool
    artists: List[Artist]
    disc_number: int
    track_number: int

class AlbumTracks(BaseModel):
    tracks: List[Track]
    total: int
    offset: int
    limit: int