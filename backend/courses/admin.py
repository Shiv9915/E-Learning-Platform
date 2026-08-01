from django.contrib import admin

from .models import (
    Category,
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
    Review,
    Wishlist,
    Payment,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = ("name",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "instructor",
        "category",
        "price",
        "level",
        "is_published",
    )

    list_filter = (
        "category",
        "level",
        "is_published",
    )

    search_fields = (
        "title",
        "instructor__username",
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "course",
        "order",
    )

    list_filter = ("course",)

    search_fields = ("title",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "student",
        "course",
        "enrolled_at",
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "student",
        "course",
        "amount",
        "paid_at",
    )


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "student",
        "course",
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "student",
        "course",
        "rating",
    )


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "student",
        "lesson",
        "completed",
    )
