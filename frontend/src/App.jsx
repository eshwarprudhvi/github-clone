import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/user/Profile";
import AllUsers from "./components/user/AllUsers";
import RepositoryDetail from "./components/repo/RepositoryDetail";
import CreateRepo from "./components/repo/CreateRepo";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateRepo />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/repo/:id"
        element={
          <ProtectedRoute>
            <RepositoryDetail />
          </ProtectedRoute>
        }
      ></Route>
       <Route
        path="/profile/:userId/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/profile/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      ></Route>
     
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        }
      ></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
  );
}

export default App;
