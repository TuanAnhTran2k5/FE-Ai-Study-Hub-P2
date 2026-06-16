import axios from "axios";
import type { DocumentResponse } from "@/types/document.type";

const API_URL = import.meta.env.VITE_API_URL;

export const getDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await axios.get<DocumentResponse[]>(
    `${API_URL}/documents`
  );

  return response.data;
};