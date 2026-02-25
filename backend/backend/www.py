import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.endpoints import meetup, poi

app = FastAPI(root_path="/api")

static_file_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_file_path), name="static")

# endpoint registration 
app.include_router(meetup.router, prefix="/meetup", tags=["meetup"])
app.include_router(poi.router, prefix="/poi", tags=["poi"])

@app.get("/", include_in_schema=False)
async def root() -> RedirectResponse:
    return RedirectResponse("/docs")