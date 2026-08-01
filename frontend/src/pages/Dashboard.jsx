import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [enrollments, setEnrollments] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_courses: 0,
    published_courses: 0,
    total_lessons: 0,
    total_students: 0,
    total_reviews: 0,
    average_rating: 0,
  });
  const [progress, setProgress] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
    fetchProgress();
    fetchMyCourses();
    fetchAnalytics();
    fetchWishlist();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get("courses/my-enrollments/");

      console.log("Dashboard API:", response.data);

      setEnrollments(response.data);
      console.log("Length:", response.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get("courses/my-progress/");

      setProgress(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const response = await api.get("courses/my-courses/");

      console.log("My Courses:", response.data);
      console.log("Total Courses:", response.data.length);

      setMyCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`courses/${id}/delete/`);

      alert("Course deleted successfully.");

      fetchMyCourses();
    } catch (error) {
      console.error(error);

      alert("Failed to delete course.");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("courses/analytics/");

      console.log("Analytics:", response.data);

      setAnalytics(response.data);
      const paymentResponse = await api.get("courses/payments/");

      setPayments(paymentResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get("courses/my-wishlist/");

      setWishlist(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCertificate = (courseName) => {
    const doc = new jsPDF("landscape");

    doc.setDrawColor(0);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.text("CERTIFICATE OF COMPLETION", 148, 40, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");

    doc.text("This Certificate is Proudly Presented To", 148, 65, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setFontSize(26);

    doc.text(user.username, 148, 90, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);

    doc.text("For successfully completing the course", 148, 110, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setFontSize(22);

    doc.text(courseName, 148, 130, {
      align: "center",
    });

    doc.setFontSize(14);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, 170);

    doc.text("Instructor", 230, 170);

    doc.save(`${courseName}-certificate.pdf`);
  };

  const downloadInvoice = (payment) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("PAYMENT INVOICE", 20, 20);

    doc.setFontSize(14);

    doc.text(`Course: ${payment.course_title}`, 20, 45);
    doc.text(`Amount: ₹${payment.amount}`, 20, 60);
    doc.text(`Payment ID: ${payment.razorpay_payment_id}`, 20, 75);
    doc.text(`Order ID: ${payment.razorpay_order_id}`, 20, 90);

    doc.text(
      `Date: ${new Date(payment.paid_at).toLocaleDateString()}`,
      20,
      105,
    );

    doc.save(`${payment.course_title}-invoice.pdf`);
  };

  const progressPercentage =
    enrollments.length === 0
      ? 0
      : Math.round((progress.length / enrollments.length) * 100);

  const barData = [
    {
      name: "Courses",
      value: analytics.total_courses,
    },
    {
      name: "Students",
      value: analytics.total_students,
    },
    {
      name: "Lessons",
      value: analytics.total_lessons,
    },
    {
      name: "Reviews",
      value: analytics.total_reviews,
    },
  ];

  const pieData = [
    {
      name: "Published",
      value: analytics.published_courses,
    },
    {
      name: "Draft",
      value: Math.max(analytics.total_courses - analytics.published_courses, 0),
    },
  ];

  const COLORS = ["#2563eb", "#f97316"];

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold">Welcome {user?.username} 👋</h1>

        <p className="text-gray-600 mt-3">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold">Enrolled Courses</h2>

            <p className="text-4xl mt-4 text-blue-600">{enrollments.length}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold">Completed</h2>

            <p className="text-4xl mt-4 text-green-600">{progress.length}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold">Certificates</h2>

            <p className="text-4xl mt-4 text-purple-600">0</p>
          </div>
        </div>
        <div className="mt-10 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>

          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className="bg-green-600 h-5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <p className="mt-3 font-semibold text-green-700">
            {progressPercentage}% Completed
          </p>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">My Enrolled Courses</h2>

          {enrollments.length === 0 ? (
            <p className="text-gray-500">
              You haven't enrolled in any course yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <h3 className="text-2xl font-bold text-blue-600">
                    {item.course}
                  </h3>

                  <p className="text-gray-500 mt-2">Enrolled On:</p>

                  <p className="font-medium">
                    {new Date(item.enrolled_at).toLocaleDateString()}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/courses/${item.course_id}`}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Continue Learning
                    </Link>

                    {progress.length > 0 && (
                      <button
                        onClick={() => downloadCertificate(item.course)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Instructor Analytics</h2>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Course Status</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={110} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Total Courses</h3>

              <p className="text-4xl text-blue-600 mt-2">
                {analytics.total_courses}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Published</h3>

              <p className="text-4xl text-green-600 mt-2">
                {analytics.published_courses}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Lessons</h3>

              <p className="text-4xl text-orange-600 mt-2">
                {analytics.total_lessons}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Students</h3>

              <p className="text-4xl text-purple-600 mt-2">
                {analytics.total_students}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Total Reviews</h3>

              <p className="text-4xl text-pink-600 mt-2">
                {analytics.total_reviews}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold text-gray-500">Average Rating</h3>

              <p className="text-3xl text-yellow-500 mt-2">
                ⭐ {analytics.average_rating}/5
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">My Created Courses</h2>

          {myCourses.length === 0 ? (
            <p className="text-gray-500">No courses created yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <h3 className="text-2xl font-bold text-blue-600">
                    {course.title}
                  </h3>

                  <p className="text-gray-500 mt-2">{course.description}</p>

                  <div className="mt-5 flex gap-3">
                    <Link
                      to={`/edit-course/${course.id}`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    {/* <Link
                      to={`/manage-lessons/${course.id}`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Manage Lessons
                    </Link> */}

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">❤️ My Wishlist</h2>

          {wishlist.length === 0 ? (
            <p className="text-gray-500">No courses in wishlist.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <h3 className="text-2xl font-bold text-pink-600">
                    {item.course}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Added on {new Date(item.created_at).toLocaleDateString()}
                  </p>

                  <Link
                    to={`/courses/${item.course_id}`}
                    className="inline-block mt-5 bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700"
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">💳 Payment History</h2>

          {payments.length === 0 ? (
            <p className="text-gray-500">No payment history found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-green-600">
                    Payment Successful
                  </h3>

                  <p className="mt-3">
                    <strong>Course:</strong> {payment.course_title}
                  </p>

                  <p>
                    <strong>Amount:</strong> ₹{payment.amount}
                  </p>

                  <p>
                    <strong>Payment ID:</strong> {payment.razorpay_payment_id}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(payment.paid_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => downloadInvoice(payment)}
                    className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    📄 Download Invoice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
