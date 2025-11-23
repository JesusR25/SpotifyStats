export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface UserInfo {
  userID: string;
  email: string;
  display_name: string;
  country: string;
  followers: number;
  product: string;
  images?: Image;
}

export interface Artist {
  name: string;
  genres: string[];
  uri: string;
  popularity: number;
  followers: number;
  image?: Image;
}

export interface TopArtist {
  artists: Artist[];
  limit: number;
  offset: number;
  total: number;
}

export interface Album {
  name: string;
  album_type: string;
  release_date: string;
  cover?: Image;
}

export interface Track {
  name: string;
  popularity: number;
  artist?: string[];
  duration: number;
  explicit: boolean;
  album: Album;
}

export interface TopTracks {
  tracks: Track[];
  limit: number;
  offset: number;
  total: number;
}

export interface Cursors {
  before?: string;
  after?: string;
}

export interface ArtistsFollowByUser {
  Artist: Artist[];
  limit: number;
  total: number;
  cursors: Cursors;
}

// Tipos para álbumes
export interface AlbumArtist {
  id: string;
  name: string;
}

export interface AlbumDetail {
  id_album: string;
  name: string;
  album_type: string;
  total_tracks: number;
  release_date: string;
  cover: Image;
  genres: string[];
  artist: AlbumArtist[];
}

export interface AlbumSaved {
  added_at: string;
  album: AlbumDetail;
}

export interface SavedAlbumsByUser {
  AlbumsSaved: AlbumSaved[];
  limit: number;
  offset: number;
  total: number;
}

export interface AlbumTrack {
  trackID: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: AlbumArtist[];
  disc_number: number;
  track_number: number;
}

export interface AlbumTracks {
  tracks: AlbumTrack[];
  total: number;
  offset: number;
  limit: number;
}

// Tipos para Player
export interface Device {
  deviceID: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  deviceType: string;
  volume_percent: number;
  supports_volume: boolean;
}

export interface PlayerTrack {
  trackID: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: AlbumArtist[];
  disc_number: number;
  track_number: number;
  album?: AlbumDetail;
}

export interface PlaybackState {
  device: Device;
  track: PlayerTrack;
  repeat_state: string;
  shuffle_state: boolean;
  progress_ms: number;
  is_playing: boolean;
  currently_playing_type: string;
  actions?: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}

