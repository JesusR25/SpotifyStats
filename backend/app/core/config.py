from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    #MONGODB_CONNECTION_STRING: str
    JWT_KEY: str
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    SPOTIFY_REDIRECT_URI: str
    FRONTEND_URL: str

    class Config:
        env_file = ".env"  # Permite cargar desde archivo .env

settings = Settings()
