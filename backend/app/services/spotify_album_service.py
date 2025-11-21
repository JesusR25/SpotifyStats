from app.clients.spotify_client import SpotifyClient
from app.schemas.library import AlbumSaved, SavedAlbumsByUser, AlbumTracks
#from app.schemas.spotify_album import Image, Artist, Album, Track, AlbumTracks
from app.utils.parsers import parse_album, parse_artist, parse_tracks
from fastapi import HTTPException


class AlbumService():
    def __init__(self):
        self.spotifyclient = SpotifyClient()


    async def get_albums_saved_user(self, limit: int, offset: int, token: str):
        try:

            data = await self.spotifyclient.get_albums_save_user(
                limit=limit,
                offset=offset,
                token=token
            )

            total = data['total']
            items = data['items']
            offset = data['offset']
            all_albums = []

            for item in items:
                added_at = item['added_at']
                album = item['album']
                album_data = parse_album(album)

                album_added = AlbumSaved(
                    added_at=added_at,
                    album=album_data
                )
                all_albums.append(album_added)


            response = SavedAlbumsByUser(
                AlbumsSaved=all_albums,
                limit=limit,
                offset=offset,
                total=total
            )

            return response


        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de los albumes guardados: {e}")




    async def get_album(self, albumID: str, token: str):
        try:

            data = await self.spotifyclient.get_album(
                albumID=albumID,
                token=token
            )

            album_data = parse_album(data)

            return album_data


        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el album: {e}")




    async def get_tracks_album(self, albumID: str, offset: int, limit: int, token: str):
        try:

            data = await self.spotifyclient.get_tracks_album(offset=offset, albumID=albumID, limit=limit, token=token)
            limit = data['limit']
            offset = data['offset']
            total = data['total']
            items = data['items']

            tracks_list = []

            for item in items:
                track_info = parse_tracks(item)
                tracks_list.append(track_info)

            response = AlbumTracks(
                limit=limit,
                offset=offset,
                total=total,
                tracks=tracks_list
            )

            return response

        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el album: {e}")