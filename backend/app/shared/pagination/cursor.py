import base64
import json
from typing import Any, Dict, List, Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class CursorPageInfo(BaseModel):
    next_cursor: Optional[str] = None
    has_next: bool

class CursorPage(BaseModel, Generic[T]):
    items: List[T]
    page_info: CursorPageInfo

def encode_cursor(cursor_data: Dict[str, Any]) -> str:
    """Encodes a dictionary of cursor parameters to a base64 string."""
    try:
        json_str = json.dumps(cursor_data)
        return base64.b64encode(json_str.encode("utf-8")).decode("utf-8")
    except Exception:
        return ""

def decode_cursor(cursor_str: Optional[str]) -> Optional[Dict[str, Any]]:
    """Decodes a base64 string cursor parameters into a dictionary."""
    if not cursor_str:
        return None
    try:
        decoded_bytes = base64.b64decode(cursor_str.encode("utf-8"))
        return json.loads(decoded_bytes.decode("utf-8"))
    except Exception:
        return None
