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


    async def get_followed_artists(self, token: str, after: str = None, limit: int = 10):
        url_final = f'{self.base_url}/me/following'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'type': 'artist',
            'after': after,
            'limit': limit
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url_final, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()


    async def get_albums_save_user(self, limit:int, offset:int, token:str):
        url_final = f'{self.base_url}/me/albums'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'limit': limit,
            'offset': offset
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url_final, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()


    async def get_album(self, albumID: str, token:str):
        url_final = f'{self.base_url}/albums/{albumID}'
        headers = {
            'Authorization': f'Bearer {token}'
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url_final, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()




    async def get_tracks_album(self, albumID: str, offset: int, limit: int, token: str):
        url_final = f'{self.base_url}/albums/{albumID}/tracks'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'limit': limit,
            'offset': offset
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url_final, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()



    async def get_recently_played(self, limit: int, after: str, before: str, token: str):
        url = f'{self.base_url}/me/player/recently-played'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'limit': limit
        }

        if after:
            params['after'] = after
        elif before:
            params['before'] = before

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()


    async def pause_playback(self, device_id: str, token: str):
        url = f'{self.base_url}/me/player/pause'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'device_id': device_id
        }

        async with httpx.AsyncClient() as client:
            response = await client.put(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()



    async def start_resume_playback(self, device_id: str, context_uri: str, position: int, position_ms: int, token: str):
        url = f'{self.base_url}/me/player/play'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'device_id': device_id
        }

        body = {}
        if context_uri:
            body['context_uri'] = context_uri
        if position:
            body['position_ms'] = position_ms
        if position:
            body['offset'] = {}
            body['offset']['position'] = position



        async with httpx.AsyncClient() as client:
            response = await client.put(url, headers=headers, params=params, data=body)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()



    async def get_playback_state(self, token: str):
        url = f'{self.base_url}/v1/me/player'
        headers = {
            'Authorization': f'Bearer {token}'
        }

        async with httpx.AsyncClient() as client:
            response = await client.put(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()