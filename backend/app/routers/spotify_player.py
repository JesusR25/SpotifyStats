from fastapi import APIRouter, Request, HTTPException
from app.schemas.spotify_player import TracksRecentlyPlayed
from app.utils.cookies import get_tokens_from_cookies

router = APIRouter(
    prefix="/player",
    tags=["Player"]
)


@router.get('/recently_played', response_model=TracksRecentlyPlayed)
async def get_recently_played(request: Request, limit: int = 10, after: int = None, before: int = str):
    try:
        access_token,_ =get_tokens_from_cookies(request)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error a la hora de obtener las ultimas canciones reproducidas: {e}")