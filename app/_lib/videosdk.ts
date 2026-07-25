"use client";

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_VIDEOSDK_URL;

export const validateMeeting = async (id: string) => {
  if (!id) throw new Error("Meeting ID is required");

  const { data } = await axios.get(`${BASE_URL}/rooms/${id}`);

  if (!data.valid) {
    throw new Error("Invalid meeting ID");
  }

  const meeting = data?.data;

  if (!meeting) {
    throw new Error("Missing room in response");
  }

  return meeting;
};

export const getUserId = () => {
  const token = localStorage.getItem("vsdk_id");
  return token;
};
