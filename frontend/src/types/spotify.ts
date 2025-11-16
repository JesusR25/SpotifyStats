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
  image: Image;
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

