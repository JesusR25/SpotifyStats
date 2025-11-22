from app.clients.spotify_client import SpotifyClient
from app.utils.parsers import parse_user, parse_artist, parse_album, parse_tracks
from app.schemas.base.cursors import Cursors
from app.schemas.top import TopArtist, TopTracks
from app.schemas.library import ArtistsFollowByUser

#from app.schemas.spotify_statistics import UserInfo, TopArtist, Artist, Image, TopTracks, Album, Track, Cursors, ArtistsFollowByUser
from fastapi import HTTPException

class SpotifyService():
    def __init__(self):
        self.spotifyclient = SpotifyClient()
        



    async def get_user_info(self, token: str):
        try:
            user_data = await self.spotifyclient.get_user_info(token=token)
            user_info = parse_user(user_data)

            return user_info


        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener la información del usuario: {e}")



    async def get_top_artist(self,time_range: str, limit: int, offset: int, token: str):
        try:
            range_valids = ["long_term", "medium_term", "short_term"]
            if time_range not in range_valids:
                raise HTTPException(status_code=400, detail="Por favor ingrese un rango de tiempo válido.")

            data = await self.spotifyclient.get_user_top_items(
                type="artists",
                time_range=time_range,
                limit=limit,
                offset=offset,
                token=token
            )

            artist_in_data = data.get('items', [])
            artist_list = []

            for artist in artist_in_data:
                artist_data = parse_artist(artist)
                artist_list.append(artist_data)


            limit_data = data.get('limit', limit)
            offset_data = data.get('offset', offset)
            total_data = data.get('total', 0)

            return TopArtist(
                artists=artist_list,
                limit=limit_data,
                offset=offset_data,
                total=total_data
            )

        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el top de artistas: {e}")



    async def get_top_tracks(self,time_range: str, limit: int, offset: int, token: str):
        try:
            range_valids = ["long_term", "medium_term", "short_term"]
            if time_range not in range_valids:
                raise HTTPException(status_code=400, detail="Por favor ingrese un rango de tiempo válido.")

            data = await self.spotifyclient.get_user_top_items(
                type="tracks",
                time_range=time_range,
                limit=limit,
                offset=offset,
                token=token
            )

            tracks_in_data = data.get('items', [])
            tracks_list = []

            for track in tracks_in_data:
                album = track['album']
                album_data = parse_album(album)
                track_data = parse_tracks(track)
                track_data.album = album_data


                tracks_list.append(track_data)


            limit_data = data.get('limit', limit)
            offset_data = data.get('offset', offset)
            total_data = data.get('total', 0)

            return TopTracks(
                tracks=tracks_list,
                limit=limit_data,
                offset=offset_data,
                total=total_data
            )

        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el top de artistas: {e}")



    async def get_followed_artists(self, token: str, after: str = None, limit: int = 10):
        try:
            data = await self.spotifyclient.get_followed_artists(after=after, limit=limit, token=token)
            artists = data.get('artists', {})
            cursors_data = artists.get('cursors')
            cursor_response = Cursors(after=cursors_data['after'])
            items = artists.get('items')
            total = artists.get('total')

            artist_list = []
            for item in items:
                artist_data = parse_artist(item)
                artist_list.append(artist_data)



            response = ArtistsFollowByUser(
                Artist=artist_list,
                limit=limit,
                total=total,
                cursors=cursor_response
            )

            return response

        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener los artistas seguidos por el usuario: {e}")