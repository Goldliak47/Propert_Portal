import os, bcrypt, jwt
from datetime import datetime, timedelta, timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from .models import User

JWT_SECRET = os.getenv("JWT_SECRET", "dev")
JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", "60"))

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def check_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def make_token(user_id: str):
    exp = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)
    payload = {"sub": str(user_id), "exp": int(exp.timestamp())}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> str:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return data["sub"]
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Token expired")
    except Exception:
        raise exceptions.AuthenticationFailed("Invalid token")

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None  # let DRF treat as unauthenticated
        token = auth.split(" ", 1)[1]
        user_id = verify_token(token)
        user = User.objects(id=user_id).first()
        if not user:
            raise exceptions.AuthenticationFailed("User not found")
        request.user = user
        return (user, None)