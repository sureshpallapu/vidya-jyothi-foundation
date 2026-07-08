import { useState } from "react";


import { useNavigate } from "react-router-dom";
import axios from "axios";


function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {

    const response = await axios.post(
      "http://localhost:5000/api/admin/login",
      {
        username,
        password,
      }
    );

    if (response.data.success) {

      /*
      |--------------------------------------------------------------------------
      | Save Login Session
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      /*
      |--------------------------------------------------------------------------
      | Save Admin Details
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      navigate("/admin/dashboard");

    } else {

      alert("Invalid Username or Password");

    }

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Login Failed"
    );

  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-yellow-700">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Vidya Jyothi Foundation
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;