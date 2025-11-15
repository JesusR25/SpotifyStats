from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from app.routers import auth, spotify


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://spotify-stats-three-kappa.vercel.app"],  # en producción deberías poner tu dominio
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
app.include_router(spotify.router, prefix="/api")