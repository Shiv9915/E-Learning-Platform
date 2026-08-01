import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    youtube_url: "",
    price: "",
    duration: "",
    level: "Beginner",
    is_published: true,
  });

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`courses/${id}/`);

      setFormData({
        title: response.data.title,
        description: response.data.description,
        category: response.data.category,
        youtube_url: response.data.youtube_url,
        price: response.data.price,
        duration: response.data.duration,
        level: response.data.level,
        is_published: response.data.is_published,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await api.put(`courses/${id}/update/`, formData);

      alert("Course updated successfully.");

      navigate("/my-courses");
    } catch (error) {
      console.error(error);

      console.log(error.response);

      console.log(error.response?.data);

      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Edit Course</h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            rows="5"
          />

          <input type="hidden" name="category" value={formData.category} />

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
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
            Published
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Update Course
          </button>
        </form>
      </div>
    </>
  );
}

export default EditCourse;
