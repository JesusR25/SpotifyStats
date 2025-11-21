from app.clients.spotify_client import SpotifyClient
from app.schemas.spotify_statistics import UserInfo, TopArtist, Artist, Image, TopTracks, Album, Track, Cursors, ArtistsFollowByUser
from fastapi import HTTPException

class SpotifyService():
    def __init__(self):
        self.spotifyclient = SpotifyClient()
        


    async def get_user_info(self, token: str):
        try:
            user_data = await self.spotifyclient.get_user_info(token=token)
            images = user_data.get('images', [])
            image_data = Image(**images[0]) if images else None

            user_info = UserInfo(
                userID=user_data['id'],
                email=user_data['email'],
                display_name=user_data['display_name'],
                country=user_data['country'],
                followers=user_data['followers']['total'],
                product=user_data['product'],
                images= image_data
            )


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
                images = artist.get('images', [])
                image_data = Image(**images[0]) if images else None

                artist_data = Artist(
                    name = artist['name'],
                    genres=artist['genres'],
                    uri=artist['uri'],
                    popularity=artist['popularity'],
                    followers = artist["followers"]["total"],
                    image=image_data
                )
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
                images = album.get('images', [])
                image_data = Image(**images[0]) if images else None
                artists = album.get('artists')
                artists_name = []

                for artist in artists:
                    name = artist['name']
                    artists_name.append(name)


                album_model = Album(
                    name=album['name'],
                    album_type=album['album_type'],
                    release_date=album['release_date'],
                    cover=image_data
                )

                track_model = Track(
                    name=track['name'],
                    popularity=track['popularity'],
                    artist=artists_name,
                    duration=track['duration_ms'],
                    explicit=track['explicit'],
                    album=album_model
                )

                tracks_list.append(track_model)


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
                images = item.get('images', [])
                image_data = Image(**images[0]) if images else None

                artist_item = Artist(
                    name=item['name'],
                    genres=item['genres'],
                    uri=item['uri'],
                    popularity=item['popularity'],
                    followers=item['followers']['total'],
                    image=image_data
                )

                artist_list.append(artist_item)



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