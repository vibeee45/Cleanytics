import time
from typing import Any, Optional, Dict, Tuple

class SimpleCache:
    def __init__(self, default_ttl: int = 60):
        self.default_ttl = default_ttl
        self.cache: Dict[str, Tuple[Any, float]] = {}

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expire_at = time.time() + (ttl if ttl is not None else self.default_ttl)
        self.cache[key] = (value, expire_at)

    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        value, expire_at = self.cache[key]
        if time.time() > expire_at:
            del self.cache[key]
            return None
        return value

    def delete(self, key: str) -> None:
        if key in self.cache:
            del self.cache[key]

    def clear(self) -> None:
        self.cache.clear()

cache = SimpleCache()
