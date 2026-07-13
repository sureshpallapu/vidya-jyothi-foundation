import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { login } from "../../utils/adminAuth";

function AdminLogin() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

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
        | Save Admin Session
        |--------------------------------------------------------------------------
        */

        login(response.data.admin);

        /*
        |--------------------------------------------------------------------------
        | Redirect Dashboard
        |--------------------------------------------------------------------------
        */

        navigate("/admin/dashboard", {

          replace: true,

        });

      }

      else {

        alert("Invalid username or password.");

      }

    }

    catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Login failed."

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

          {/* Username */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">

              Username

            </label>

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Password */}

          <div className="mb-6">

            <label className="block mb-2 font-medium">

              Password

            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Login */}

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition"
          >

            Login

          </button>

        </form>

      </div>

    </div>

  );

}

export default AdminLogin;