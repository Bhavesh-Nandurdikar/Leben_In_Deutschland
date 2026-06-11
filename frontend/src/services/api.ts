import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const getQuestions = async () => {
  const response = await api.get("/questions");
  return response.data;
};