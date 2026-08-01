from rest_framework.permissions import BasePermission


class IsInstructorOrAdmin(BasePermission):

    message = (
        "Only instructors and admins can perform this action."
    )

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return request.user.role in [
            "instructor",
            "admin",
        ]
        
class IsCourseOwnerOrAdmin(BasePermission):

    message = (
        "You can only modify your own course."
    )

    def has_object_permission(self, request, view, obj):

        if request.user.role == "admin":
            return True

        return obj.instructor == request.user