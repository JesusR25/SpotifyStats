from fastapi import APIRouter, Request, HTTPException
from app.schemas.library import SavedAlbumsByUser, Album, AlbumTracks
#from app.schemas.spotify_album import SavedAlbumsByUser, Album, AlbumTracks
from app.services.spotify_album_service import AlbumService
from app.utils.cookies import get_tokens_from_cookies

router = APIRouter(
    prefix="/album",
    tags=["Albumes"]
)

album_service = AlbumService()


@router.get('/saved_by_user', response_model=SavedAlbumsByUser)
async def albums_saved_by_user(request: Request, limit: int = 10, offset: int = 0):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await album_service.get_albums_saved_user(limit=limit, offset=offset,token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener los albumes guardados por el usuario: {e}")



@router.get("/{album_id}", response_model=Album)
async def get_album(request: Request, album_id: str):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await album_service.get_album(albumID=album_id, token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener los albumes guardados por el usuario: {e}")




@router.get("/{album_id}/tracks", response_model=AlbumTracks)
async def tracks_in_album(request: Request, album_id: str, limit: int = 50, offset: int = 0):
    try:
        access_token,_ =get_tokens_from_cookies(request)
        response = await album_service.get_tracks_album(albumID=album_id, limit=limit, offset=offset, token=access_token)
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener los albumes guardados por el usuario: {e}")
