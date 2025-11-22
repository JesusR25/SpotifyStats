from pydantic import BaseModel

class Device(BaseModel):
    deviceID: str
    is_active: bool
    is_private_session: bool
    is_restricted: bool
    name: str
    deviceType: str
    volume_percent: int
    supports_volume: bool