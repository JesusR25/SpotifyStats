import axios from 'axios';
import type { UserInfo, TopArtist, TopTracks, ArtistsFollowByUser } from '../types/spotify';
import { API_BASE_URL } from '../config/api';

// Axios configurado correctamente
const api = axios.create({
  baseURL: API_BASE_URL,   // <-- Usa este dominio para todas las peticiones
  withCredentials: true,   // <-- ENVÍA COOKIES
});

// No necesitas la ruta completa aquí
export const authService = {
  login: () => {
    window.location.href = `${API_BASE_URL}/api/auth/login`;
  },
};

// TODAS las rutas deben ser RELATIVAS
export const spotifyService = {
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>("/api/spotify/me");
    return response.data;
  },

  getTopArtists: async (
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopArtist> => {
    const response = await api.get<TopArtist>("/api/spotify/top-artist-user", {
      params: { time_range: timeRange, limit, offset },
    });
    return response.data;
  },

  getTopTracks: async (
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopTracks> => {
    const response = await api.get<TopTracks>("/api/spotify/top-tracks-user", {
      params: { time_range: timeRange, limit, offset },
    });
    return response.data;
  },

  getFollowedArtists: async (
    limit: number = 10,
    after?: string
  ): Promise<ArtistsFollowByUser> => {
    const response = await api.get<ArtistsFollowByUser>("/api/spotify/artist-follow-user", {
      params: { limit, after, type: 'artist' },
    });
    return response.data;
  },
};
