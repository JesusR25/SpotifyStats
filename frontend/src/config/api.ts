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
  PLAYER: {
    PLAYBACK_STATE: `${API_BASE_URL}/api/player/playback_state`,
    PAUSE: (deviceId: string) => `${API_BASE_URL}/api/player/${deviceId}/pause_playback`,
    PLAY: (deviceId: string) => `${API_BASE_URL}/api/player/${deviceId}/play_resume_playback`,
    NEXT: (deviceId: string) => `${API_BASE_URL}/api/player/${deviceId}/skip_to_next`,
    PREVIOUS: (deviceId: string) => `${API_BASE_URL}/api/player/${deviceId}/skip_to_previous`,
    RECENTLY_PLAYED: `${API_BASE_URL}/api/player/recently_played`,
  },
};

