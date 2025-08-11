from rest_framework_mongoengine.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        # return only the current user's properties
        return Property.objects(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        # attach current user on create
        serializer.save(user=self.request.user)