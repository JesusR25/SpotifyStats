from app.schemas.base.image import Image
from app.schemas.base.artist import Artist
from app.schemas.base.album import Album
from app.schemas.base.track import Track
from app.schemas.base.user import User
from app.schemas.base.device import Device


def parse_artist(artist):
    try:
        images = artist.get('images', [])
        if images: 
            image_data = Image(**images[0]) if images else None
        else:
            image_data = None

        genres_artist = artist.get('genres', None)
        popularity_artist = artist.get('popularity', None)
        followers_artist = artist.get('followers', {}).get('total', None)

        artist_data = Artist(
            id=artist['id'],
            name = artist['name'],
            genres=genres_artist,
            uri=artist['uri'],
            popularity=popularity_artist,
            followers =followers_artist,
            image=image_data
        )
        return artist_data

    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información de los artistas: {e}")


def parse_album(album):
    try:
        genres = album.get('genres', [])
        images = album.get('images', [])
        image_data = Image(**images[0]) if images else None

        artists = album['artists']
        artist_list = []
        for artist in artists:
            artist_data = parse_artist(artist)
            artist_list.append(artist_data)

        album_data = Album(
            id_album=album['id'],
            name=album['name'],
            album_type=album['album_type'],
            total_tracks=album['total_tracks'],
            release_date=album['release_date'],
            genres=genres,
            cover=image_data,
            artist=artist_list
        )

        return album_data

    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información del album: {e}")


def parse_tracks(track):
    try:
        artists = track['artists']
        artist_list = []
        for artist in artists:
            artist_data = parse_artist(artist)
            artist_list.append(artist_data)

        track_info = Track(
            trackID=track['id'],
            name=track['name'],
            duration_ms=track['duration_ms'],
            artists= artist_list,
            explicit=track['explicit'],
            disc_number=track['disc_number'],
            track_number=track['track_number']
        )

        return track_info

    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información de la canción: {e}")



def parse_user(user):
    try:
        images = user.get('images', [])
        image_data = Image(**images[0]) if images else None

        user_info = User(
            userID=user['id'],
            email=user['email'],
            display_name=user['display_name'],
            country=user['country'],
            followers=user['followers']['total'],
            product=user['product'],
            images= image_data
        )

        return user_info

    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información del usuario: {e}")


def parse_device(device):
    try:
        device_response = Device(
            deviceID=device['id'],
            is_active=device['is_active'],
            is_private_session=device['is_private_session'],
            is_restricted=device['is_restricted'],
            name=device['name'],
            deviceType=device['type'],
            volume_percent=device['volume_percent'],
            supports_volume=device['supports_volume']
        )
        return device_response
    except Exception as e:
        print(f"Ocurrio un error al tratar de obtener la información dl dispositivo: {e}")