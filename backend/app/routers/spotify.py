from fastapi import APIRouter, Request, HTTPException
from utils.cookies import get_tokens_from_cookies
from schemas.spotify import TopArtist, TopTracks, UserInfo, ArtistsFollowByUser
from services.spotify_service import SpotifyService

router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"]
)

spotify_service = SpotifyService()



@router.get("/me", response_model=UserInfo)
async def get_user_info(request: Request):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await spotify_service.get_user_info(access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información del usuario.")



@router.get("/top-artist-user", response_model=TopArtist)
async def top_artist_user(request: Request, time_range: str = "medium_term", limit: int = 20, offset: int = 0):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        data = await spotify_service.get_top_artist(limit=limit,offset=offset,time_range=time_range,token=access_token)
        return data

    except HTTPException:
        raise
    except Exception as e:
        print("Ocurrio un error tratando de obtener los artistas mes escuchados por el usuario.")



@router.get("/top-tracks-user", response_model=TopTracks)
async def top_track_user(request: Request, time_range: str = "medium_term", limit: int = 20, offset: int = 0):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        data = await spotify_service.get_top_tracks(limit=limit,offset=offset,time_range=time_range,token=access_token)
        return data

    except HTTPException:
        raise
    except Exception as e:
        print("Ocurrio un error tratando de obtener los artistas mas escuchados por el usuario.")



# Ruta para Obtener artistas que sigue el usuario
@router.get("/artist-follow-user", response_model=ArtistsFollowByUser)
async def artist_folow_by_user(request: Request, type: str = "artist", after: str = None, limit: int = 10):
    try:
        access_token,_ =get_tokens_from_cookies(request)
    except HTTPException:
        raise
    except Exception as e:
        print("Ocurrio un error tratando de obtener los artistas seguidos por el usuario.")