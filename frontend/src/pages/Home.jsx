import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";

function Home() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [search, level]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("courses/", {
        params: {
          search: search,
          level: level,
        },
      });

      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Courses
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600">
              No Courses Found
            </h3>

            <p className="text-gray-500 mt-2">
              Try another search keyword or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
