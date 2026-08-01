import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
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
      const response = await api.post("accounts/change-password/", formData);

      alert(response.data.message);

      navigate("/profile");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.error || "Failed to change password.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto py-12 px-6">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Change Password</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              name="old_password"
              placeholder="Old Password"
              value={formData.old_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
