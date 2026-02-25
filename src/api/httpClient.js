const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://adminbackend.ramadreamsgroup.com/api/v1"
).replace(/\/+$/, "");
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

const buildUrl = (path) =>
  path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const apiRequest = async ({
  path,
  method = "GET",
  token,
  body,
  isFormData = false,
}) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isFormData && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
};

export const toApiAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${API_ORIGIN}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
};
