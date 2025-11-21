from pydantic import BaseModel
from typing import List
from .base.track import Track
from .base.album import Album


class AlbumTracks(BaseModel):
    tracks: List[Track]
    total: int
    offset: int
    limit: int


class AlbumSaved(BaseModel):
    added_at: str
    album: Album


class SavedAlbumsByUser(BaseModel):
    AlbumsSaved: List[AlbumSaved]
    limit: int
    offset: int
    total: int