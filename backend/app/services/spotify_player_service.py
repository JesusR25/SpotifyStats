from fastapi import HTTPException
from app.clients.spotify_client import SpotifyClient
from app.schemas.spotify_player import Album, Artist, Cursors, Image, Track, TrackPlayed, TracksRecentlyPlayed, Device, PlaybackActions, PlaybackState

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



    async def play_resume_playback(self, device_id: str, context_uri: str, position: int, position_ms: int, token: str):
        try:
            data = await self.spotifyclient.start_resume_playback(
                device_id=device_id, 
                context_uri=context_uri,
                position=position, 
                position_ms=position_ms,
                token=token
            )
            print(data)
            return 200


        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el contenido reproducido recientemente: {e} ")



    async def playback_state(self, token: str):
        try:
            data = await self.spotifyclient.get_playback_state(token=token)

            device_in_response = data['device']
            device_response = Device(
                deviceID=device_in_response['id'],
                is_active=device_in_response['is_active'],
                is_private_session=device_in_response['is_private_session'],
                is_restricted=device_in_response['is_restricted'],
                name=device_in_response['name'],
                deviceType=device_in_response['type'],
                volume_percent=device_in_response['volume_percent'],
                supports_volume=device_in_response['supports_volume']
            )

            currently_playing_type = data['currently_playing_type']
            item = data['item']

            if currently_playing_type == 'track':
                album = item['album']
                artists_in_album = album['artists']
                images_album = album['images']
                cover_album = Image(**images_album[0]) if images_album else None

                artist_album_list = []

                for artist in artists_in_album:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_album_list.append(artist_data)


                album_response = Album(
                    name=album['name'],
                    album_type=album['album_type'],
                    release_date=album['release_date'],
                    cover=cover_album,
                    artists=artist_album_list
                )

                artist_list = []
                artist_track = item['artists']
                for artist in artist_track:
                    artist_data = Artist(
                        id=artist['id'],
                        name=artist['name']
                    )
                    artist_list.append(artist_data)

                track_info = Track(
                    name=item['name'],
                    popularity=item['popularity'],
                    artist=artist_list,
                    duration=item['duration_ms'],
                    explicit=item['explicit'],
                    album=album_response
                )
                print(track_info)


                playback_state = PlaybackState(
                    device=device_response,
                    track=track_info,
                    repeat_state=data['repeat_state'],
                    shuffle_state=data['shuffle_state'],
                    progress_ms=data['progress_ms'],
                    is_playing=data['is_playing'],
                    currently_playing_type=data['currently_playing_type']
                )


                return playback_state

            elif currently_playing_type == 'episode':
                print("Un episodio")
            else:
                return None



        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el estado del reproductor: {e} ")