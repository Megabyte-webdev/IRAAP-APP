import axios from "axios";

export async function getProjectByIdServer(id: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    );
    return data?.project;
  } catch (err) {
    return null;
  }
}
