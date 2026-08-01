import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          E-Learning
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>

              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>

              {user?.role === "instructor" && (
                <Link to="/my-courses" className="hover:text-blue-600">
                  My Courses
                </Link>
              )}

              <span className="font-semibold">Hi, {user?.username} 👋</span>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
