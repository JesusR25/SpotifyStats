from app.core.config import settings
from fastapi.responses import RedirectResponse
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.utils.cookies import set_tokens_in_cookies
import requests
import base64

class AuthService():
    def __init__(self):
        self.spotify_client_id = settings.SPOTIFY_CLIENT_ID
        self.spotify_secret = settings.SPOTIFY_CLIENT_SECRET
        self.redirect_uri = settings.SPOTIFY_REDIRECT_URI
        self.frontend_url = settings.FRONTEND_URL



    def handle_spotify_callback(self, code: str, state: str):
        try:
            url = 'https://accounts.spotify.com/api/token'
            data = {
                "code": code,
                "redirect_uri": self.redirect_uri,
                "grant_type": "authorization_code",
            }

            credentials = f"{self.spotify_client_id}:{self.spotify_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()

            headers = {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': f'Basic {encoded_credentials}'
            }

            response = requests.post(url=url, headers=headers, data=data)
            if response.status_code == 200:
                response_data = response.json()

                response = RedirectResponse(url=f"{settings.FRONTEND_URL}/success-vinculation")
                set_tokens_in_cookies(response=response, tokens=response_data)
                
                return response
            else:
                raise HTTPException(status_code=response.status_code, detail="Ocurrio un error al obtener los tokens con Spotify.")



        except Exception as e:
            print(f"Ocurrio un error al tratar de obtener el token despues de la reedirección: {e}")
            raise HTTPException(status_code=500, detail="Ocurrio un error al intentar obtener los tokens de la cuenta de spotify.")


    # Esta función la utilizare para el middlewarwe, cambiare el refresh token por un access token.
    def refresh_token(self, refresh_token):
        try:
            url = 'https://accounts.spotify.com/api/token'
            data = {
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token,
                'client_id': self.spotify_client_id
            }
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }


            response = requests.post(url=url, headers=headers, data=data)
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail=f"No se pudo obtener el nuevo token desde Spotify: {response.status_code}")

        except HTTPException:
            raise

        except Exception as e:
            print(f"Ocurrio un error en refresh_token: {e}")
            raise HTTPException(status_code=500, detail="Ocurrio un error tratando de refrescar el token")

