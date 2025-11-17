from fastapi import HTTPException
from app.clients.spotify_client import SpotifyClient
from app.schemas.spotify_player import Album, Artist, Cursors, Image, Track, TrackPlayed, TracksRecentlyPlayed

class PlayerService():
    def __init__(self):
        self.spotifyclient = SpotifyClient()


    async def get_recently_player(self, limit: int, before: str, after: str, token: str):
        try:
            data = await self.spotifyclient.get_recently_played(limit, after, before, token)
            limit = data['limit']
            cursors = data['cursors']

            items = data['items']
            tracks_recently_response = []
            for item in items:
                played_at = item['played_at']
                track_in_response = item['track']
                album_track = track_in_response['album']

                images_album = album_track.get('images', [])
                cover_album = Image(**images_album[0]) if images_album else None

                # Artistas del album
                artist_data = album_track['artists']
                artist_list = []

                for artist in artist_data:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_list.append(artist_data)

                # Creamos el album para la respuesta
                album_response = Album(
                    name=album_track['name'],
                    album_type=album_track['album_type'],
                    release_date=album_track['release_date'],
                    cover=cover_album,
                    artists=artist_list
                )

                # Artistas del track
                item_artists = track_in_response['artists']
                artist_in_track = []
                for artist in item_artists:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_in_track.append(artist_data)

                track_data = Track(
                    name=track_in_response['name'],
                    popularity=track_in_response['popularity'],
                    artist=artist_in_track,
                    duration=track_in_response['duration_ms'],
                    explicit=track_in_response['explicit'],
                    album=album_response
                )

                track_response = TrackPlayed(
                    played_at=played_at,
                    track=track_data
                )

                tracks_recently_response.append(track_response)

            cursors_response = Cursors(
                after=cursors['after'],
                before=cursors['before']
            )

            response = TracksRecentlyPlayed(
                cursors=cursors_response,
                limit=limit,
                tracks=tracks_recently_response
            )


            return response


        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el contenido reproducido recientemente: {e} ")



    async def pause_playback(self, device_id: str, token: str):
        try:
            data = await self.spotifyclient.pause_playback(device_id=device_id, token=token)
            print(data)
            return 200


        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el contenido reproducido recientemente: {e} ")