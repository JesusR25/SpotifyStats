import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { UserInfo, TopArtist, TopTracks, ArtistsFollowByUser } from '../types/spotify';

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

