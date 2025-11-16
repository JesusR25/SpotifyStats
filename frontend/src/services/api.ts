import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { 
  UserInfo, 
  TopArtist, 
  TopTracks, 
  ArtistsFollowByUser,
  SavedAlbumsByUser,
  AlbumDetail,
  AlbumTracks
} from '../types/spotify';

const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: () => {
    window.location.href = API_ENDPOINTS.AUTH.LOGIN;
  },

  callback: async (code: string, state: string): Promise<void> => {
    const response = await api.get(API_ENDPOINTS.AUTH.CALLBACK, {
      params: { code, state },
    });
    return response.data;
  },
};

export const spotifyService = {
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(API_ENDPOINTS.SPOTIFY.ME);
    return response.data;
  },

  getTopArtists: async (
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopArtist> => {
    const response = await api.get<TopArtist>(API_ENDPOINTS.SPOTIFY.TOP_ARTISTS, {
      params: { time_range: timeRange, limit, offset },
    });
    return response.data;
  },

  getTopTracks: async (
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopTracks> => {
    const response = await api.get<TopTracks>(API_ENDPOINTS.SPOTIFY.TOP_TRACKS, {
      params: { time_range: timeRange, limit, offset },
    });
    return response.data;
  },

  getFollowedArtists: async (
    limit: number = 10,
    after?: string
  ): Promise<ArtistsFollowByUser> => {
    const response = await api.get<ArtistsFollowByUser>(API_ENDPOINTS.SPOTIFY.FOLLOWED_ARTISTS, {
      params: { limit, after, type: 'artist' },
    });
    return response.data;
  },
};

export const albumService = {
  getSavedAlbums: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<SavedAlbumsByUser> => {
    const response = await api.get<SavedAlbumsByUser>(API_ENDPOINTS.ALBUM.SAVED_BY_USER, {
      params: { limit, offset },
    });
    return response.data;
  },

  getAlbum: async (albumId: string): Promise<AlbumDetail> => {
    const response = await api.get<AlbumDetail>(API_ENDPOINTS.ALBUM.GET_ALBUM(albumId));
    return response.data;
  },

  getAlbumTracks: async (
    albumId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AlbumTracks> => {
    const response = await api.get<AlbumTracks>(API_ENDPOINTS.ALBUM.GET_ALBUM_TRACKS(albumId), {
      params: { limit, offset },
    });
    return response.data;
  },
};

