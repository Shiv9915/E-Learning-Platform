import LessonPlayer from "./pages/LessonPlayer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import EditCourse from "./pages/EditCourse";
import AddLesson from "./pages/AddLesson";
import ManageLessons from "./pages/ManageLessons";
import EditLesson from "./pages/EditLesson";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import LearnCourse from "./pages/LearnCourse";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor"
        element={
          <ProtectedRoute>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-course"
        element={
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-course/:id"
        element={
          <ProtectedRoute>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-lesson/:id"
        element={
          <ProtectedRoute>
            <AddLesson />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-lessons/:id"
        element={
          <ProtectedRoute>
            <ManageLessons />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-lesson/:id"
        element={
          <ProtectedRoute>
            <EditLesson />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/courses/:id" element={<CourseDetails />} />

      <Route
        path="/learn/:id"
        element={
          <ProtectedRoute>
            <LessonPlayer />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<h1>Hello</h1>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
