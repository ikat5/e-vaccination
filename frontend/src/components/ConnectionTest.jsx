import React, { useState, useEffect } from "react";
import api from "../services/api";

const ConnectionTest = () => {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get("/test");
        if (response.data.success) {
          setStatus("connected");
          setMessage(response.data.message);
        } else {
          setStatus("error");
          setMessage("Backend responded but with an error");
        }
      } catch (error) {
        setStatus("error");
        if (error.code === "ECONNREFUSED" || error.message.includes("Network")) {
          setMessage(
            "Cannot connect to backend. Make sure the backend server is running on port 3000."
          );
        } else {
          setMessage(error.message || "Connection failed");
        }
      }

      // ⏳ Automatically hide after 3 seconds
      setTimeout(() => setVisible(false), 3000);
    };

    testConnection();
  }, []);

  if (!visible) return null; // hide component entirely

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border-2 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Backend Connection</h3>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "connected"
              ? "bg-green-500"
              : status === "error"
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
          }`}
        />
        <span
          className={`text-sm ${
            status === "connected"
              ? "text-green-700"
              : status === "error"
              ? "text-red-700"
              : "text-yellow-700"
          }`}
        >
          {status === "connected"
            ? "Connected"
            : status === "error"
            ? "Disconnected"
            : "Checking..."}
        </span>
      </div>
      {message && <p className="text-xs text-gray-600 mt-2">{message}</p>}
    </div>
  );
};

export default ConnectionTest;
