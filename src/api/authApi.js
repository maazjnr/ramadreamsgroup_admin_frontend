import { apiRequest } from "./httpClient";

export const loginRequest = (credentials) =>
  apiRequest({
    path: "/auth/login",
    method: "POST",
    body: credentials,
  });

export const getMeRequest = (token) =>
  apiRequest({
    path: "/auth/me",
    method: "GET",
    token,
  });
