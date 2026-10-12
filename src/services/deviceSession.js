import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const DEVICE_EVENT_NAME = import.meta.env.VITE_DEVICE_EVENT_NAME;

export const checkLoginToServer = (onSessionExpired) => {
  const userId = localStorage.getItem("userId");
  const deviceId = localStorage.getItem("deviceId");

  if (!userId || !deviceId) {
    return;
  }

  if (socket?.connected) {
    return;
  }

  disconnect();

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Device session socket connected:", socket.id);

    // EXACTLY Flutter jaisa payload
    socket.emit(DEVICE_EVENT_NAME, {
      user_id: userId,
    });

    console.log("Socket payload:", {
      user_id: userId,
    });
  });

  socket.on(DEVICE_EVENT_NAME, (data) => {

    const serverDeviceId = data?.device_id;

    // console.log("Local Device ID:", deviceId);
    // console.log("Server Device ID:", serverDeviceId);

    if (!serverDeviceId) {
      console.warn("Server response does not contain device_id:", data);
      return;
    }

    if (String(serverDeviceId) !== String(deviceId)) {
      console.log("Logged in from another browser");

      onSessionExpired?.();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Device session socket error:", error);
  });
};

export const disconnect = () => {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket.close();
  socket = null;
};

export const getSocket = () => socket;