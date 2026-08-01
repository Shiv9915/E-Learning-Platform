from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (INSTRUCTOR, "Instructor"),
        (ADMIN, "Admin"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=STUDENT
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username