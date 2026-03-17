import { Master, CombinedResponse } from "../types/common";

export const API = import.meta.env.VITE_API_URL;


export async function fetchMasters(id: string): Promise<Master> {
  const response = await fetch(`${API}/master/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch master");
  }
  return response.json();
}

export async function fetchStars(id: string) {
    const response = await fetch(`${API}/stars/${id}`);
    if (!response.ok) {
    throw new Error("Failed to fetch stars");
  }
  return response.json();
}

export async function fetchClass() {
  const response = await fetch(`${API}/class`);
  if (!response.ok) {
    throw new Error("Failed to fetch class");
  }
  return response.json();
  
}

export async function fetchCombinedData(account: string): Promise<CombinedResponse> {
  const response = await fetch(`${API}/user-data?account=${account}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? response.statusText);
  }
  return data;
}
