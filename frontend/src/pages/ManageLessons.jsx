import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ManageLessons() {
  const { id } = useParams();

  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await api.get(`courses/${id}/lessons/`);

      setLessons(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (lessonId) => {
    const confirmDelete = window.confirm("Delete this lesson?");

    if (!confirmDelete) return;

    try {
      await api.delete(`courses/lessons/${lessonId}/delete/`);

      alert("Lesson deleted successfully.");

      fetchLessons();
    } catch (error) {
      console.error(error);

      alert("Failed to delete lesson.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Manage Lessons</h1>

        <Link
          to={`/add-lesson/${id}`}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          + Add Lesson
        </Link>

        <div className="mt-8 space-y-5">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white shadow rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">
                  Lesson {lesson.order}: {lesson.title}
                </h2>

                <p className="text-gray-500">{lesson.description}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/edit-lesson/${lesson.id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ManageLessons;
