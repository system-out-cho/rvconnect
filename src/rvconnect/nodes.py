import subprocess
import shutil
from server import PromptServer
from aiohttp import web

RV_EXECUTABLE = shutil.which("rv")

@PromptServer.instance.routes.post("/open_in_rv")
async def open_in_rv(request):
    data = await request.json()
    path = data.get("path", "")

    if not path:
        return web.Response(status=400, text="No path provided")

    try:
        subprocess.Popen([RV_EXECUTABLE, path])
        return web.Response(status=200, text="Launched")
    except FileNotFoundError:
        return web.Response(status=500, text=f"OpenRV not found at: {RV_EXECUTABLE}")
    except Exception as e:
        return web.Response(status=500, text=str(e))

# Required so ComfyUI loads this file
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}