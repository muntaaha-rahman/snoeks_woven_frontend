import type { Visit, VisitInput, VisitListItem } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Thrown when a request never reached the server (offline / DNS / connection refused). */
export class NetworkError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new NetworkError(`Could not reach the server for ${path}`);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(response.status, body || response.statusText);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export interface VisitFilters {
  search?: string;
  city?: string;
  surveyor_name?: string;
  date_from?: string;
  date_to?: string;
}

export function listVisits(filters: VisitFilters = {}): Promise<VisitListItem[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return request<VisitListItem[]>(`/visits${query ? `?${query}` : ""}`);
}

export function getVisit(id: string): Promise<Visit> {
  return request<Visit>(`/visits/${id}`);
}

export function createVisit(data: VisitInput): Promise<Visit> {
  return request<Visit>("/visits", { method: "POST", body: JSON.stringify(data) });
}

export function updateVisit(id: string, data: VisitInput): Promise<Visit> {
  return request<Visit>(`/visits/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteVisit(id: string): Promise<void> {
  return request<void>(`/visits/${id}`, { method: "DELETE" });
}

export function resendEmail(id: string): Promise<Visit> {
  return request<Visit>(`/visits/${id}/resend-email`, { method: "POST" });
}

export function pdfUrl(id: string): string {
  return `${API_BASE}/visits/${id}/pdf`;
}

export function uploadUrl(): string {
  return `${API_BASE}/photos`;
}

export async function uploadPhoto(ownerType: string, ownerId: string, file: File) {
  const params = new URLSearchParams({ owner_type: ownerType, owner_id: ownerId });
  const form = new FormData();
  form.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${uploadUrl()}?${params.toString()}`, { method: "POST", body: form });
  } catch {
    throw new NetworkError("Could not reach the server to upload the photo");
  }
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
}

export function fileUrl(filePath: string): string {
  return `${API_BASE}${filePath}`;
}
