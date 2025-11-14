from fastapi import FastAPI, Depends
from routers import auth, spotify


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Bienvenido a Spotify Stats"}

@app.get("/success-vinculation")
async def success_vinculation():
    return {"message": "Felicidades, te haz vinculado correctamente!"}


app.include_router(auth.router)
app.include_router(spotify.router)