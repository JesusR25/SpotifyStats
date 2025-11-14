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

