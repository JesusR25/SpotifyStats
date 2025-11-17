from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import spotify_statistics, spotify_album, spotify_player
from app.routers import auth


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://spotify-stats-three-kappa.vercel.app", "https://spotifystats-5prz.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenido a Spotify Stats"}

@app.get("/success-vinculation")
async def success_vinculation():
    return {"message": "Felicidades, te haz vinculado correctamente!"}


app.include_router(auth.router, prefix="/api")
app.include_router(spotify_statistics.router, prefix="/api")
app.include_router(spotify_album.router,prefix="/api")
app.include_router(spotify_player.router,prefix="/api")