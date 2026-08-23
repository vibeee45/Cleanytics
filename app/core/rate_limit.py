import time
from fastapi import HTTPException, status, Request
from collections import defaultdict
import threading

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.tokens = defaultdict(lambda: float(requests_per_minute))
        self.last_updated = defaultdict(time.time)
        self.lock = threading.Lock()

    def check_rate_limit(self, key: str):
        with self.lock:
            now = time.time()
            elapsed = now - self.last_updated[key]
            self.last_updated[key] = now
            
            # Replenish tokens
            replenish_rate = self.requests_per_minute / 60.0
            self.tokens[key] = min(
                float(self.requests_per_minute),
                self.tokens[key] + elapsed * replenish_rate
            )

            if self.tokens[key] < 1.0:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later."
                )
            
            self.tokens[key] -= 1.0

# Define limiters for various contexts
auth_limiter = RateLimiter(requests_per_minute=30)
upload_limiter = RateLimiter(requests_per_minute=15)

def rate_limit_auth(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    auth_limiter.check_rate_limit(f"auth:{client_ip}")

def rate_limit_upload(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    upload_limiter.check_rate_limit(f"upload:{client_ip}")
