import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const imageUrl = course.thumbnail
    ? course.thumbnail
    : "https://placehold.co/600x400?text=No+Thumbnail";

  console.log(course.thumbnail);

  console.log(course);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
      <img
        src={imageUrl}
        alt={course.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3">{course.title}</h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Instructor:</strong> {course.instructor}
          </p>

          <p>
            <strong>Level:</strong> {course.level}
          </p>

          <p>
            <strong>Duration:</strong> {course.duration}
          </p>

          <p>
            <strong>Price:</strong> ₹{course.price}
          </p>

          <p className="text-yellow-500 font-semibold">
            ⭐ {course.average_rating}/5
          </p>
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="block mt-6 bg-blue-600 text-white py-3 rounded-lg text-center hover:bg-blue-700"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
