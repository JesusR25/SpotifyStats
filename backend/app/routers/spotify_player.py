from fastapi import APIRouter, Request, HTTPException, Response
#from app.schemas.spotify_player import TracksRecentlyPlayed
from app.schemas.player import TracksRecentlyPlayed
from app.services.spotify_player_service import PlayerService
from app.utils.cookies import get_tokens_from_cookies

router = APIRouter(
    prefix="/player",
    tags=["Player"]
)

player_service = PlayerService()



# Proximo endpoint: Obtener estado actual del reproductor.
@router.get("/playback_state")
async def playback_state(request: Request):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.playback_state(token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de reproducir la musica: {e}")



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



@router.get("/{device_id}/skip_to_next")
async def skip_to_next(request: Request, device_id: str):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.skip_to_next(device_id=device_id, token=access_token)
        return Response(status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de adelanta a la siguiente canción: {e}")



@router.get("/{device_id}/skip_to_previous")
async def skip_to_previous(request: Request, device_id: str):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await player_service.skip_to_previous(device_id=device_id, token=access_token)
        return Response(status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de devolver a la anterior canción: {e}")

        