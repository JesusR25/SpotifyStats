from pydantic import BaseModel
from typing import Optional, List
from app.schemas.base.cursors import Cursors
from app.schemas.base.device import Device
from app.schemas.base.track import Track


class TrackPlayed(BaseModel):
    track: Track
    played_at: str


class TracksRecentlyPlayed(BaseModel):
    tracks: List[TrackPlayed]
    limit: int
    cursors: Cursors



class PlaybackActions(BaseModel):
    interrupting_playback: Optional[bool]
    pausing: Optional[bool]
    resuming: Optional[bool]
    seeking: Optional[bool]
    skipping_next: Optional[bool]
    skipping_prev: Optional[bool]
    toggling_repeat_context: Optional[bool]
    toggling_shuffle: Optional[bool]
    toggling_repeat_track: Optional[bool]
    transferring_playback: Optional[bool]



class PlaybackState(BaseModel):
    device: Device
    track: Track
    repeat_state: str
    shuffle_state: bool
    progress_ms: int
    is_playing: bool
    currently_playing_type:str
    actions: Optional[PlaybackActions] = None