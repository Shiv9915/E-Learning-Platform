import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function LearnCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`courses/${id}/`);

      setCourse(response.data);

      if (response.data.lessons.length > 0) {
        setCurrentLesson(response.data.lessons[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markComplete = async () => {
    try {
      await api.post(`courses/lessons/${currentLesson.id}/complete/`);

      alert("Lesson completed successfully!");
    } catch (error) {
      console.error(error);

      alert("Failed to mark lesson as complete.");
    }
  };

  if (!course || !currentLesson) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">Loading...</div>
      </>
    );
  }

  const videoId = currentLesson.youtube_url.split("v=")[1]?.split("&")[0];

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={currentLesson.title}
            allowFullScreen
            className="rounded-xl"
          />

          <h2 className="text-3xl font-bold mt-6">{currentLesson.title}</h2>

          <p className="text-gray-600 mt-3">{currentLesson.description}</p>
          <button
            onClick={markComplete}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            ✅ Mark as Complete
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-5">Lessons</h2>

          <div className="space-y-3">
            {course.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full text-left p-3 rounded-lg ${
                  currentLesson.id === lesson.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                Lesson {lesson.order}
                <br />
                {lesson.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LearnCourse;
