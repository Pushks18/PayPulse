//frontend/src/socket.js
import { io } from "socket.io-client";

// Replace with your backend's URL
const SOCKET_URL = "https://paypulse.onrender.com";

// Initialize the Socket.IO client
const socket = io(SOCKET_URL, {
  withCredentials: true, // Allow cookies and headers
  transports: ["websocket"], // Use WebSocket as the transport
});

// Log connection status
socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
