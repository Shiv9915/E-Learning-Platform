import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function LessonPlayer() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`courses/${id}/`);
      setCourse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const completeLesson = async () => {
    try {
      const lessonId = course.lessons[0].id;

      const response = await api.post(`courses/lessons/${lessonId}/complete/`);

      alert(response.data.message);

      setCompleted(true);
    } catch (error) {
      console.error(error);

      alert("Unable to mark lesson as completed.");
    }
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-xl">Loading...</div>
      </>
    );
  }

  const lesson = course.lessons[0];

  const videoId = lesson.youtube_url.split("v=")[1]?.split("&")[0];

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold">{course.title}</h1>

        <h2 className="text-2xl font-semibold mt-8">{lesson.title}</h2>

        <p className="text-gray-600 mt-3">{lesson.description}</p>

        <div className="mt-8 aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={lesson.title}
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-8">
          <button
            onClick={completeLesson}
            disabled={completed}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {completed ? "Lesson Completed ✅" : "Mark as Completed"}
          </button>
        </div>

        <div className="flex justify-between mt-10">
          <Link
            to={`/courses/${id}`}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Course
          </Link>

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}

export default LessonPlayer;
