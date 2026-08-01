import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function EditLesson() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    order: 1,
  });

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const response = await api.get(`courses/lessons/${id}/`);

      setFormData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`courses/lessons/${id}/update/`, formData);

      alert("Lesson updated successfully.");

      navigate(-1); // Previous page par wapas
    } catch (error) {
      console.error(error);

      alert("Failed to update lesson.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Edit Lesson</h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Update Lesson
          </button>
        </form>
      </div>
    </>
  );
}

export default EditLesson;
