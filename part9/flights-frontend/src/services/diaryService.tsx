import axios from "axios";
const baseUrl = "http://localhost:3000/api/diaries";

import { DiaryEntry, NewDiaryEntry } from "../types/diary";

export const getDiaries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
}

export const createDiary = async (object: NewDiaryEntry) => {
  const response = await axios.post(baseUrl, object);
  return response.data;
}