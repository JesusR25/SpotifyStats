from fastapi import APIRouter, Request, HTTPException
from app.schemas.spotify_player import TracksRecentlyPlayed
from app.services.spotify_player_service import PlayerService
from app.utils.cookies import get_tokens_from_cookies

router = APIRouter(
    prefix="/player",
    tags=["Player"]
)

player_service = PlayerService()

@router.get('/recently_played', response_model=TracksRecentlyPlayed)
async def get_recently_played(request: Request, limit: int = 10, after: int = None, before: int = None):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.get_recently_player(after=after, before=before, limit=limit, token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error a la hora de obtener las ultimas canciones reproducidas: {e}")



@router.put("/{device_id}/pause_playback")
async def pause_playback(request: Request, device_id: str):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.pause_playback(device_id=device_id, token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de pausar la musica: {e}")


@router.put("/{device_id}/play_resume_playback")
async def play_resume_playback(request: Request, device_id: str, context_uri: str = None, position: int = None, position_ms: int = None, token: str = None):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.play_resume_playback(
            device_id=device_id,
            context_uri=context_uri,
            position=position,
            position_ms=position_ms,
            token=access_token
        )
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de reproducir la musica: {e}")


# Proximo endpoint: Obtener estado actual del reproductor.
