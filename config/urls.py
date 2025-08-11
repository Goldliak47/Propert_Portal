from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("authx.urls")),
    path("api/properties/", include("properties.urls")),
]