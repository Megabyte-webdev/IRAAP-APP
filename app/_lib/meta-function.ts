import axios from "axios";

export async function getProjectByIdServer(id: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    );
    return data?.project?.[0];
  } catch (err) {
    return null;
  }
}

export async function getRoom(id: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_VIDEOSDK_URL}/rooms/${id}`,
    );
    return data?.data;
  } catch (err) {
    return null;
  }
}
