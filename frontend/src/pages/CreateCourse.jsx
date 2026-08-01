import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: null,
    youtube_url: "",
    price: "",
    duration: "",
    level: "Beginner",
    is_published: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await api.post("courses/create/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course Created Successfully!");

      navigate("/instructor");
    } catch (error) {
      console.error(error);

      alert("Unable to create course.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-8">Create Course</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            placeholder="Course Title"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="category"
            placeholder="Category ID"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <div>
            <label className="block mb-2 font-medium">Course Thumbnail</label>

            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <input
            name="youtube_url"
            placeholder="Youtube URL"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="duration"
            placeholder="Duration"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="level"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Create Course
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateCourse;
