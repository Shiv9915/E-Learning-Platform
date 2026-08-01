import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AddLesson() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    order: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`courses/${id}/lessons/create/`, formData);

      alert("Lesson added successfully.");

      navigate("/my-courses");
    } catch (error) {
      console.error(error);

      alert("Failed to add lesson.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Add Lesson</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Lesson Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Lesson Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="youtube_url"
            placeholder="YouTube URL"
            value={formData.youtube_url}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="order"
            placeholder="Lesson Order"
            value={formData.order}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Add Lesson
          </button>
        </form>
      </div>
    </>
  );
}

export default AddLesson;
