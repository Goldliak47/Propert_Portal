from rest_framework_mongoengine.routers import DefaultRouter
from .views import PropertyViewSet

router = DefaultRouter()
router.register(r"", PropertyViewSet, basename="property")

urlpatterns = router.urls