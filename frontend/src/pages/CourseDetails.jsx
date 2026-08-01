import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
// import Razorpay from "razorpay";

function CourseDetails() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchCourse();
    fetchReviews();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`courses/${id}/`);
      setCourse(response.data);
      const enrollments = await api.get("courses/my-enrollments/");

      const alreadyEnrolled = enrollments.data.some(
        (item) => item.course_id === Number(id),
      );

      setEnrolled(alreadyEnrolled);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`courses/${id}/reviews/`);

      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`courses/${id}/payment/`);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "E-Learning Platform",
        description: data.course,
        order_id: data.order_id,

        handler: async function (response) {
          try {
            await api.post(`courses/${id}/verify-payment/`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("🎉 Payment Verified Successfully!");

            setEnrolled(true);

            fetchCourse();
          } catch (error) {
            console.error(error);

            alert("Payment verification failed.");
          }
        },

        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);

        alert(
          response.error.description || "Payment failed. Please try again.",
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Unable to start payment.");
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const response = await api.post(`courses/${id}/enroll/`);

      alert(response.data.message);

      setEnrolled(true);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Enrollment failed.");
      }
    }
  };

  const handleWishlist = async () => {
    try {
      const response = await api.post(`courses/${id}/wishlist/`);

      alert(response.data.message);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add to wishlist.");
      }
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();

    try {
      await api.post(`courses/${id}/reviews/`, {
        rating,
        comment,
      });

      alert("Review submitted successfully!");

      setRating(5);
      setComment("");

      fetchReviews();
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to submit review.");
      }
    }
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-xl">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

        <p className="text-gray-600 mb-8">{course.description}</p>

        <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
          <p>
            <strong>Level:</strong> {course.level}
          </p>

          <p>
            <strong>Duration:</strong> {course.duration}
          </p>

          <p>
            <strong>Price:</strong> ${course.price}
          </p>
          <hr className="my-6" />

          <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>

          {course.lessons.length === 0 ? (
            <p className="text-gray-500">No lessons available.</p>
          ) : (
            <div className="space-y-4">
              {course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      Lesson {lesson.order}: {lesson.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {lesson.description}
                    </p>
                  </div>

                  <Link
                    to={`/learn/${id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Watch
                  </Link>
                </div>
              ))}
            </div>
          )}

          <p>
            <strong>Instructor:</strong> {course.instructor}
          </p>

          <p>
            <strong>Category:</strong> {course.category}
          </p>
          <button
            onClick={handlePayment}
            disabled={loading || enrolled}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {enrolled ? "Enrolled Successfully" : `Buy Course ₹${course.price}`}
          </button>
          <button
            onClick={handleWishlist}
            className="mt-3 w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
          >
            ❤️ Add to Wishlist
          </button>
          <hr className="my-8" />

          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>

          <form onSubmit={handleReview} className="space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows="4"
              className="w-full border rounded-lg px-4 py-3"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Submit Review
            </button>
          </form>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <h3 className="font-semibold">{review.student}</h3>

                    <p className="text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </p>

                    <p className="mt-2 text-gray-700">{review.comment}</p>

                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
