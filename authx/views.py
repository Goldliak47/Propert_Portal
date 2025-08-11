from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import User
from .serializers import RegisterSerializer, LoginSerializer
from .auth import hash_password, check_password, make_token

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        if User.objects(email=s.validated_data["email"]).first():
            return Response({"detail": "Email already registered"}, status=400)

        user = User(
            name=s.validated_data["name"],
            email=s.validated_data["email"],
            password_hash=hash_password(s.validated_data["password"]),
        ).save()

        token = make_token(str(user.id))
        return Response({
            "token": token,
            "user": {"id": str(user.id), "name": user.name, "email": user.email}
        })

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        user = User.objects(email=s.validated_data["email"]).first()
        if not user or not check_password(s.validated_data["password"], user.password_hash):
            return Response({"detail": "Invalid credentials"}, status=400)

        token = make_token(str(user.id))
        return Response({
            "token": token,
            "user": {"id": str(user.id), "name": user.name, "email": user.email}
        })

class MeView(APIView):
    def get(self, request):
        u = request.user
        return Response({"id": str(u.id), "name": u.name, "email": u.email})