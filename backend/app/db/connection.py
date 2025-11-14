from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = None

async def get_database():
    global client
    if client is None:
        client = AsyncIOMotorClient(settings.MONGODB_CONNECTION_STRING)
    return client["SpotifyStats"]
