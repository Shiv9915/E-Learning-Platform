from django.db.models import Count, Avg
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import razorpay
from django.conf import settings
from .permissions import (
    IsInstructorOrAdmin,
    IsCourseOwnerOrAdmin,
)

from .models import (
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    Review,
    Wishlist,
    Payment,
)
from .serializers import (
    CourseSerializer,
    CourseDetailSerializer,
    CourseCreateSerializer,
    EnrollmentSerializer,
    LessonProgressSerializer,
    CourseEditSerializer,
    LessonCreateSerializer,
    LessonSerializer,
    ReviewSerializer,
    WishlistSerializer,
    PaymentSerializer,
)


class CourseListAPIView(generics.ListAPIView):

    serializer_class = CourseSerializer

    queryset = Course.objects.filter(is_published=True).select_related(
        "instructor",
        "category",
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "category",
        "level",
    ]

    search_fields = [
        "title",
        "description",
    ]

    ordering_fields = [
        "price",
        "created_at",
        "title",
    ]

    ordering = [
        "-created_at",
    ]


class CourseDetailAPIView(generics.RetrieveAPIView):

    serializer_class = CourseDetailSerializer

    queryset = (
        Course.objects.filter(is_published=True)
        .prefetch_related("lessons")
        .select_related(
            "category",
            "instructor",
        )
    )


class CourseCreateAPIView(generics.CreateAPIView):

    serializer_class = CourseCreateSerializer

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save(instructor=request.user)

        return Response(
            {
                "message": "Course created successfully.",
                "course": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class CourseUpdateAPIView(generics.UpdateAPIView):

    serializer_class = CourseEditSerializer

    queryset = Course.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
        IsCourseOwnerOrAdmin,
    ]


class CourseDeleteAPIView(generics.DestroyAPIView):

    queryset = Course.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
        IsCourseOwnerOrAdmin,
    ]

    def destroy(self, request, *args, **kwargs):

        super().destroy(request, *args, **kwargs)

        return Response(
            {"message": "Course deleted successfully."},
            status=status.HTTP_200_OK,
        )


class EnrollCourseAPIView(generics.CreateAPIView):

    serializer_class = EnrollmentSerializer

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        course = generics.get_object_or_404(Course, pk=pk, is_published=True)

        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user,
            course=course,
        )

        if not created:
            return Response(
                {"message": "You are already enrolled in this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EnrollmentSerializer(enrollment)

        return Response(
            {
                "message": "Enrollment successful.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class MyEnrollmentsAPIView(generics.ListAPIView):

    serializer_class = EnrollmentSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Enrollment.objects.filter(student=self.request.user).select_related(
            "course"
        )


class CompleteLessonAPIView(generics.CreateAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        lesson = generics.get_object_or_404(Lesson, pk=pk)

        progress, created = LessonProgress.objects.get_or_create(
            student=request.user,
            lesson=lesson,
        )

        progress.completed = True
        progress.save()

        serializer = LessonProgressSerializer(progress)

        return Response(
            {
                "message": "Lesson completed successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class MyProgressAPIView(generics.ListAPIView):

    serializer_class = LessonProgressSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(
            student=self.request.user,
            completed=True,
        ).select_related("lesson")


class MyCoursesAPIView(generics.ListAPIView):

    serializer_class = CourseSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user).select_related(
            "category",
            "instructor",
        )


class InstructorAnalyticsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        courses = Course.objects.filter(instructor=request.user)

        total_courses = courses.count()

        published_courses = courses.filter(is_published=True).count()

        total_lessons = Lesson.objects.filter(course__in=courses).count()

        total_students = Enrollment.objects.filter(course__in=courses).count()

        total_reviews = Review.objects.filter(course__in=courses).count()

        average_rating = (
            Review.objects.filter(course__in=courses).aggregate(avg=Avg("rating"))[
                "avg"
            ]
            or 0
        )

        return Response(
            {
                "total_courses": total_courses,
                "published_courses": published_courses,
                "total_lessons": total_lessons,
                "total_students": total_students,
                "total_reviews": total_reviews,
                "average_rating": round(average_rating, 1),
            }
        )


class LessonCreateAPIView(generics.CreateAPIView):

    serializer_class = LessonCreateSerializer

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def post(self, request, pk):

        course = generics.get_object_or_404(
            Course,
            pk=pk,
            instructor=request.user,
        )

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save(course=course)

        return Response(
            {
                "message": "Lesson created successfully.",
                "lesson": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class LessonListAPIView(generics.ListAPIView):

    serializer_class = LessonSerializer

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def get_queryset(self):

        course = generics.get_object_or_404(
            Course,
            pk=self.kwargs["pk"],
            instructor=self.request.user,
        )

        return Lesson.objects.filter(course=course).order_by("order")


class LessonDeleteAPIView(generics.DestroyAPIView):

    queryset = Lesson.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def destroy(self, request, *args, **kwargs):

        lesson = self.get_object()

        if lesson.course.instructor != request.user:
            return Response(
                {"message": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        lesson.delete()

        return Response(
            {"message": "Lesson deleted successfully."},
            status=status.HTTP_200_OK,
        )


class LessonDetailAPIView(generics.RetrieveAPIView):

    serializer_class = LessonSerializer

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def get_queryset(self):
        return Lesson.objects.filter(course__instructor=self.request.user)


class LessonUpdateAPIView(generics.UpdateAPIView):

    serializer_class = LessonCreateSerializer

    permission_classes = [
        IsAuthenticated,
        IsInstructorOrAdmin,
    ]

    def get_queryset(self):
        return Lesson.objects.filter(course__instructor=self.request.user)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop("partial", False)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "Lesson updated successfully.",
                "lesson": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class ReviewListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        return Review.objects.filter(course_id=course_id).order_by("-created_at")

    def perform_create(self, serializer):
        course = get_object_or_404(Course, id=self.kwargs["course_id"])

        serializer.save(
            student=self.request.user,
            course=course,
        )


class CreatePaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        course = get_object_or_404(Course, pk=pk)

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET,
            )
        )

        amount = int(course.price * 100)

        order = client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
            }
        )

        return Response(
            {
                "order_id": order["id"],
                "amount": amount,
                "key": settings.RAZORPAY_KEY_ID,
                "course": course.title,
            }
        )


class VerifyPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        course = get_object_or_404(Course, pk=pk)

        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET,
            )
        )

        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )

            Payment.objects.create(
                student=request.user,
                course=course,
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                amount=course.price,
            )

            Enrollment.objects.get_or_create(
                student=request.user,
                course=course,
            )

            return Response(
                {"message": "Payment verified successfully."},
                status=status.HTTP_200_OK,
            )

        except razorpay.errors.SignatureVerificationError:

            return Response(
                {"message": "Invalid payment signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WishlistCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        course = get_object_or_404(Course, pk=pk)

        wishlist, created = Wishlist.objects.get_or_create(
            student=request.user,
            course=course,
        )

        if not created:
            return Response(
                {"message": "Course already in wishlist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Added to wishlist successfully."},
            status=status.HTTP_201_CREATED,
        )


class WishlistListAPIView(generics.ListAPIView):

    serializer_class = WishlistSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(student=self.request.user).select_related(
            "course"
        )


class PaymentHistoryAPIView(generics.ListAPIView):

    serializer_class = PaymentSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Payment.objects.filter(student=self.request.user)
            .select_related("course")
            .order_by("-paid_at")
        )
