export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    CALLBACK: `${API_BASE_URL}/api/auth/callback`,
  },
  SPOTIFY: {
    ME: `${API_BASE_URL}/api/spotify/me`,
    TOP_ARTISTS: `${API_BASE_URL}/api/spotify/top-artist-user`,
    TOP_TRACKS: `${API_BASE_URL}/api/spotify/top-tracks-user`,
    FOLLOWED_ARTISTS: `${API_BASE_URL}/api/spotify/artist-follow-user`,
  },
  ALBUM: {
    SAVED_BY_USER: `${API_BASE_URL}/api/album/saved_by_user`,
    GET_ALBUM: (albumId: string) => `${API_BASE_URL}/api/album/${albumId}`,
    GET_ALBUM_TRACKS: (albumId: string) => `${API_BASE_URL}/api/album/${albumId}/tracks`,
  },
};

