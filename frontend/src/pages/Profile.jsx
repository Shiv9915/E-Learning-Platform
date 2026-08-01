import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("accounts/profile/");

      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-xl">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="space-y-5">
            <div>
              <p className="text-gray-500">Username</p>
              <h2 className="text-xl font-semibold">{profile.username}</h2>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <h2 className="text-xl font-semibold">{profile.email}</h2>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <h2 className="text-xl font-semibold">{profile.role}</h2>
            </div>

            <div>
              <p className="text-gray-500">Joined</p>
              <h2 className="text-xl font-semibold">
                {new Date(profile.date_joined).toLocaleDateString()}
              </h2>
            </div>

            <div className="mt-8">
              <button
                onClick={() => (window.location.href = "/change-password")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
