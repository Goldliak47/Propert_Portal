from rest_framework_mongoengine import serializers
from .models import Property

class PropertySerializer(serializers.DocumentSerializer):
    class Meta:
        model = Property
        fields = ("id","title","type","address","city","lat","lng","notes","created_at")
        read_only_fields = ("id","created_at")