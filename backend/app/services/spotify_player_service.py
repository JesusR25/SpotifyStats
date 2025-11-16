from app.clients.spotify_client import SpotifyClient

class PlayerService():
    def __init__(self):
        self.spotifyclient = SpotifyClient()


    def async get_recently_player(self, limit: int, before: str, after: str, token: str):
        try:
            data = self.spotifyclient.get_recently_played(limit, after, before, token)
        except HTTPException:
            raise
        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el contenido reproducido recientemente. ")