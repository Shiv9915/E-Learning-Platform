from django.db import models
from django.conf import settings


class Category(models.Model):

    name = models.CharField(max_length=100, unique=True)

    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Course(models.Model):

    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

    LEVEL_CHOICES = [
        (BEGINNER, "Beginner"),
        (INTERMEDIATE, "Intermediate"),
        (ADVANCED, "Advanced"),
    ]

    title = models.CharField(max_length=200)

    description = models.TextField()

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses"
    )

    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="courses"
    )

    thumbnail = models.ImageField(upload_to="course_thumbnails/", blank=True, null=True)

    youtube_url = models.URLField()

    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    duration = models.CharField(max_length=50)

    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default=BEGINNER)

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Lesson(models.Model):

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True, null=True)

    youtube_url = models.URLField()

    order = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Enrollment(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments"
    )

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class LessonProgress(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="progress",
    )

    completed = models.BooleanField(default=False)

    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("student", "lesson")

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"


class Review(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    rating = models.PositiveSmallIntegerField()

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class Wishlist(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="wishlist",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.username} ❤️ {self.course.title}"


class Payment(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )

    razorpay_order_id = models.CharField(max_length=200)

    razorpay_payment_id = models.CharField(max_length=200)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"
