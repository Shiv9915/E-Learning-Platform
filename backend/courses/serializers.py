from rest_framework import serializers
from .models import Wishlist
from .models import Payment

from .models import (
    Category,
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Review,
)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "description",
            "youtube_url",
            "order",
        ]


class CourseSerializer(serializers.ModelSerializer):

    instructor = serializers.StringRelatedField()

    category = serializers.StringRelatedField()

    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()

        if not reviews.exists():
            return 0

        return round(
            sum(review.rating for review in reviews) / reviews.count(),
            1,
        )

    class Meta:
        model = Course

        fields = [
            "id",
            "title",
            "description",
            "instructor",
            "category",
            "thumbnail",
            "youtube_url",
            "price",
            "duration",
            "level",
            "average_rating",
            "is_published",
        ]


class CourseDetailSerializer(serializers.ModelSerializer):

    instructor = serializers.StringRelatedField()

    category = serializers.PrimaryKeyRelatedField(read_only=True)

    category_name = serializers.StringRelatedField(source="category")

    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course

        fields = [
            "id",
            "title",
            "description",
            "instructor",
            "category",
            "category_name",
            "thumbnail",
            "youtube_url",
            "price",
            "duration",
            "level",
            "is_published",
            "lessons",
        ]


class CourseEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course

        fields = [
            "id",
            "title",
            "description",
            "category",
            "youtube_url",
            "price",
            "duration",
            "level",
            "is_published",
        ]


class CourseCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course

        fields = [
            "title",
            "description",
            "category",
            "thumbnail",
            "youtube_url",
            "price",
            "duration",
            "level",
            "is_published",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):

    student = serializers.StringRelatedField()

    course = serializers.StringRelatedField()

    course_id = serializers.IntegerField(
        source="course.id",
        read_only=True,
    )

    class Meta:
        model = Enrollment

        fields = [
            "id",
            "student",
            "course",
            "course_id",
            "enrolled_at",
        ]


class LessonProgressSerializer(serializers.ModelSerializer):

    lesson = serializers.StringRelatedField()

    class Meta:
        model = LessonProgress
        fields = [
            "id",
            "lesson",
            "completed",
            "completed_at",
        ]


class LessonCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson

        fields = [
            "title",
            "description",
            "youtube_url",
            "order",
        ]


class ReviewSerializer(serializers.ModelSerializer):

    student = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review

        fields = [
            "id",
            "student",
            "rating",
            "comment",
            "created_at",
        ]


class WishlistSerializer(serializers.ModelSerializer):

    course = serializers.StringRelatedField()
    course_id = serializers.IntegerField(source="course.id", read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "course",
            "course_id",
            "created_at",
        ]


class PaymentSerializer(serializers.ModelSerializer):

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "student",
            "course",
            "course_title",
            "razorpay_order_id",
            "razorpay_payment_id",
            "amount",
            "paid_at",
        ]
