from mongoengine import Document, StringField, FloatField, DateTimeField, ReferenceField
from datetime import datetime, timezone
from authx.models import User

def now_utc():
    return datetime.now(timezone.utc)

class Property(Document):
    meta = {"collection": "properties"}
    user = ReferenceField(User, required=True)
    title = StringField(required=True, max_length=120)
    type = StringField(required=True, choices=("owned", "rented"))
    address = StringField()
    city = StringField()
    lat = FloatField()
    lng = FloatField()
    notes = StringField()
    created_at = DateTimeField(default=now_utc)