from mongoengine import Document, StringField, DateTimeField
from datetime import datetime, timezone

def now_utc():
    return datetime.now(timezone.utc)

class User(Document):
    meta = {"collection": "users"}
    name = StringField(required=True, max_length=100)
    email = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    created_at = DateTimeField(default=now_utc)

    @property
    def is_authenticated(self) -> bool:
        # DRF permission classes expect this attribute
        return True
