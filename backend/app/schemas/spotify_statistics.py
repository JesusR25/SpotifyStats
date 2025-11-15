from pydantic import BaseModel
from typing import List, Optional

class Image(BaseModel):
    url: str
    height: int
    width: int

class Cursors(BaseModel):
    after: Optional[str]


class UserInfo(BaseModel):
    userID: str
    email: str
    display_name: str
    country: str
    followers: int
    product: str    
    images: Optional[Image]



class Artist(BaseModel):
    name: str
    genres: list[str]
    uri: str
    popularity: int
    followers: int
    image: Optional[Image]


class TopArtist(BaseModel):
    artists: List[Artist]
    limit: int
    offset: int
    total: int


class Album(BaseModel):
    name: str
    album_type: str
    release_date: str
    cover: Optional[Image]


class Track(BaseModel):
    name: str
    popularity: int
    artist: Optional[List]
    duration: int
    explicit: bool
    album: Album


class TopTracks(BaseModel):
    tracks: List[Track]
    limit: int
    offset: int
    total: int


class ArtistsFollowByUser(BaseModel):
    Artist: List[Artist]
    limit: int
    total: int
    cursors: Cursors