from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.password_validation import validate_password

from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": serializer.instance.id,
                        "username": serializer.instance.username,
                        "email": serializer.instance.email,
                        "role": serializer.instance.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            data = serializer.validated_data

            return Response(
                {
                    "message": "Login successful",
                    "access": data["access"],
                    "refresh": data["refresh"],
                    "user": {
                        "id": data["user"].id,
                        "username": data["user"].username,
                        "email": data["user"].email,
                        "role": data["user"].role,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "date_joined": user.date_joined,
            }
        )


class ChangePasswordAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not request.user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password)
        except Exception as e:
            return Response(
                {"error": list(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response({"message": "Password changed successfully."})
