import { apiRequest } from "./httpClient";

export const listPropertiesRequest = (token, params = {}) => {
  const query = new URLSearchParams(params);
  const suffix = query.toString();
  return apiRequest({
    path: `/properties${suffix ? `?${suffix}` : ""}`,
    method: "GET",
    token,
  });
};

export const getPropertyRequest = (token, id) =>
  apiRequest({
    path: `/properties/${id}`,
    method: "GET",
    token,
  });

export const createPropertyRequest = (token, formData) =>
  apiRequest({
    path: "/properties",
    method: "POST",
    token,
    body: formData,
    isFormData: true,
  });

export const updatePropertyRequest = (token, id, formData) =>
  apiRequest({
    path: `/properties/${id}`,
    method: "PATCH",
    token,
    body: formData,
    isFormData: true,
  });

export const deletePropertyRequest = (token, id) =>
  apiRequest({
    path: `/properties/${id}`,
    method: "DELETE",
    token,
  });
