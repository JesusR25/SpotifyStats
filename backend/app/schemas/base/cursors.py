from pydantic import BaseModel
from typing import Optional

class Cursors(BaseModel):
    before: Optional[str] = None
    after: Optional[str] = None
