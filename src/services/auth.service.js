import API from "./api";
import { getDeviceId } from "../utils/device";

export const loginUser = async ({ username, password }) => {
  const deviceId = getDeviceId();

  const response = await API.post("/login", {
    username,
    password,
    device_id: deviceId,
  });

  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await API.get(`/profile/${userId}`);
  return response.data;
};

export const recieverTransfer = async (userId) => {
  const res = await API.get('/recieverTransferAmountList', {
    params: {
      user_id: userId,
    },
  })

  return res.data
}
export const senderTransferList = async (userId) => {
  const res = await API.get('/senderTransferList', {
    params: {
      user_id: userId,
    },
  })

  return res.data
}