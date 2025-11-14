from fastapi import HTTPException
import httpx


class SpotifyClient:
    def __init__(self):
        self.base_url = "https://api.spotify.com/v1"


    async def get_user_info(self, token: str):
        url_final = f'{self.base_url}/me'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url=url_final, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()


    async def get_user_top_items(self, type:str, time_range:str, limit:int, offset:int, token:str):
        url_final = f'{self.base_url}/me/top/{type}'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'type': type,
            'time_range': time_range,
            'limit': limit,
            'offset': offset
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url_final, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()
