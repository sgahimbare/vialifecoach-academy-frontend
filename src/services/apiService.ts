const API = "http://localhost:5000/api/v1"

export function getToken() {
  return localStorage.getItem("accessToken")
}

export function setToken(token: string) {
  localStorage.setItem("accessToken", token)
}

export function removeToken() {
  localStorage.removeItem("accessToken")
}

// Authentication
export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  return res.json()
}

// Programs
export async function getPrograms() {
  const res = await fetch(`${API}/programs`)
  return res.json()
}

// Common Application (GF Application Portal)
export async function saveCommonApplication(data: any) {
  const res = await fetch(`${API}/common/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function getCommonApplication() {
  const res = await fetch(`${API}/common/me`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  })
  return res.json()
}

// Applications
export async function applyToProgram(programId: string, applicationData?: any) {
  const res = await fetch(`${API}/applications/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify({ programId, applicationData })
  })
  return res.json()
}

export async function getMyApplications() {
  const res = await fetch(`${API}/applications/my`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  })
  return res.json()
}

// Admin
export async function getAllApplications() {
  const res = await fetch(`${API}/admin/applications`)
  return res.json()
}

export async function updateApplicationStatus(id: string, status: string) {
  const res = await fetch(`${API}/admin/applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  return res.json()
}

// File Upload
export async function uploadFile(file: File, type: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    body: formData
  })
  return res.json()
}
