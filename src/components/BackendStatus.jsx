import { useEffect, useState } from "react";
import axios from "axios";

function BackendStatus() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/test")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage("❌ Backend Not Connected");
      });
  }, []);

  return (
    <div className="bg-green-100 border border-green-400 rounded-xl p-4 my-6">
      <h2 className="font-bold text-lg">
        Backend Status
      </h2>

      <p className="mt-2">{message}</p>
    </div>
  );
}

export default BackendStatus;