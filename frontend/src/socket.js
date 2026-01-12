import { io } from "socket.io-client";

const socket = io("https://loginsus.onrender.com", {
  transports: ["websocket"],
});

export default socket;
