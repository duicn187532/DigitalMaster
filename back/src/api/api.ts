import { AddMasterform, Master, StarForm, AddClassForm, InitInfo } from "../types/common";

export const API = "http://localhost:8080/";

export async function fetchSupervisors() {
  const response = await fetch(`${API}/supervisors`);
  if (!response.ok) {
    throw new Error("Failed to fetch supervisors");
  }
  return response.json();
}

export async function fetchStars() {
  const response = await fetch(`${API}/stars`);
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


export async function addMaster(data: AddMasterform) {
  const response = await fetch(`${API}/supervisors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  console.log("addMaster 回傳:", resData);
  return resData;
}

export async function deleteSupervisor(id: string) {
  const response = await fetch(`${API}/supervisors/${id}`, {
    method: 'DELETE'
  })
  const resData = await response.json();
  console.log("addMaster 回傳:", resData);
  return resData;
}

export async function editSupervisor(id: string, data: Master) {
  const response = await fetch(`${API}/supervisors/${id}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const resData = await response.json();
  console.log("addMaster 回傳:", resData);
  return resData;
}

export async function addStar(data: Array<StarForm>) {
  const response = await fetch(`${API}/stars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  console.log("addStar 回傳:", resData);
  return resData;
}


export async function deleteStar(id: string) {
  if (!confirm("確定要將這筆星星資料標記為嗎？")) return;
  const response = await fetch(API + '/stars/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valid: false })
  })
  if (!response.ok) {
    throw new Error("Failed to delete stars");
  }
  const resData = response.json()
  return resData;
}

export async function addClass(data: AddClassForm) {
  const response = await fetch(`${API}/class`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  console.log("addMaster 回傳:", resData);
  return resData;
}

export async function deleteClass(id: string) {
  const response = await fetch(`${API}/class/${id}`, {
    method: 'DELETE'
  })
  const resData = await response.json();
  console.log("deleteClass 回傳:", resData);
  return resData;
}


export async function fetchInitInfo() {
  const response = await fetch(`${API}/init`);
  if (!response.ok) {
    throw new Error("Failed to fetch init");
  }
  return response.json();
}

export async function updateInitInfo(data: InitInfo) {
  const response = await fetch(`${API}/init`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  console.log("updateInitInfo 回傳:", response);
  return response;
}