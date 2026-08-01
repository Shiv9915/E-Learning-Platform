import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("courses/my-courses/");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`courses/${id}/delete/`);

      alert("Course deleted successfully.");

      fetchCourses();
    } catch (error) {
      console.error(error);

      alert("Delete failed.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">My Created Courses</h1>

        {courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-lg rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-blue-600">
                  {course.title}
                </h2>

                <p className="text-gray-600 mt-3">{course.description}</p>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/edit-course/${course.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/add-lesson/${course.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add Lesson
                  </Link>

                  <Link
                    to={`/manage-lessons/${course.id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Manage Lessons
                  </Link>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyCourses;
