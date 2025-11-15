from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.services.auth_service import AuthService
from urllib.parse import urlencode
from app.core.config import settings
import secrets

router = APIRouter(
    prefix="/auth",
    tags=["Autorización"]
)

@router.get("/login")
async def login():
    state = secrets.token_urlsafe(16) # Esto nos ayuda a gener un id random, necesario para la petición a Spotify
    scope = "user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-follow-read"
    params = {
        "response_type": "code",
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "scope": scope,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "state": state,
    }
    auth_url = f"https://accounts.spotify.com/authorize?{urlencode(params)}"

    return RedirectResponse(url=auth_url)


@router.get("/callback")
async def callback(code: str, state:str):
    try:
        if not code or not state:
            raise HTTPException(status_code=500, detail="Lo sentimos, no se encontro el code o state en la URL.")
        auth_service = AuthService()
        response = auth_service.handle_spotify_callback(code=code, state=state)
        print(f"response: {response}")
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error en el callback: {e}")
