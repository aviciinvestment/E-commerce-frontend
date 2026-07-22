// Decodes the payload of a JWT without needing a library
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Reads the logged-in user's id straight out of the JWT stored in accessToken
export const getUserId = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload?.id || payload?._id || null;
};
