from app.clients.spotify_client import SpotifyClient
from app.schemas.spotify_album import Image, Artist, Album, AlbumSaved, SavedAlbumsByUser, Track, AlbumTracks
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

                images = album.get('images', [])
                image_data = Image(**images[0]) if images else None

                artists = album['artists']
                artist_list = []

                for artist in artists:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_list.append(artist_data)

                album_data = Album(
                    id_album=album['id'],
                    name=album['name'],
                    album_type=album['album_type'],
                    total_tracks=album['total_tracks'],
                    release_date=album['release_date'],
                    genres=album['genres'],
                    image=image_data,
                    artist=artist_list
                )

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

            images = data.get('images', [])
            image_data = Image(**images[0]) if images else None

            artists = data['artists']
            artist_list = []

            for artist in artists:
                artist_data = Artist(
                    id=artist['id'],
                    name=artist['name']
                )
                artist_list.append(artist_data)

            album_data = Album(
                id_album=data['id'],
                name=data['name'],
                album_type=data['album_type'],
                total_tracks=data['total_tracks'],
                release_date=data['release_date'],
                genres=data['genres'],
                image=image_data,
                artist=artist_list
            )

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
                artists = item['artists']
                artist_list = []

                for artist in artists:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_list.append(artist_data)

                track_info = Track(
                    trackID=item['id'],
                    name=item['name'],
                    duration_ms=item['duration_ms'],
                    artists= artist_list,
                    explicit=item['explicit'],
                    disc_number=item['disc_number'],
                    track_number=item['track_number']
                )
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