from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField(write_only=True)

    def validate(self, data):

        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "phone_number",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(role=User.STUDENT, **validated_data)

        user.set_password(password)

        user.save()

        return user
