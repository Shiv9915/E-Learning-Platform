import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("courses/my-courses/");

      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold">Instructor Dashboard</h1>

        <Link
          to="/create-course"
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + Create Course
        </Link>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        {courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white shadow rounded-lg p-5">
                <h3 className="text-xl font-bold">{course.title}</h3>

                <p>{course.level}</p>

                <p>₹ {course.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default InstructorDashboard;
