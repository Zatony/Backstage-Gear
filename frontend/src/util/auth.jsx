import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AUTH_CHANGED_EVENT = "authChanged";

function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

function clearStoredAuth(shouldNotify = true) {
  if (typeof window === "undefined") {
    return;
  }

  const hadStoredAuth = localStorage.getItem("token") || localStorage.getItem("expiration");

  localStorage.removeItem("token");
  localStorage.removeItem("expiration");

  if (shouldNotify && hadStoredAuth) {
    notifyAuthChanged();
  }
}

function decodeTokenSafely(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function getTokenDuration() {
  const storedDate = localStorage.getItem("expiration");

  if (!storedDate) {
    return null;
  }

  const expiration = new Date(storedDate).getTime();

  if (Number.isNaN(expiration)) {
    clearStoredAuth();
    return null;
  }

  const duration = expiration - Date.now();

  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (!decodeTokenSafely(token)) {
    clearStoredAuth();
    return null;
  }

  const duration = getTokenDuration();
  if (duration === null || duration <= 0) {
    clearStoredAuth();
    return null;
  }

  return token;
}

export function getAuthUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const decodedToken = decodeTokenSafely(token);

  if (!decodedToken) {
    clearStoredAuth();
    return null;
  }

  return decodedToken;
}

export function getAuthUserId() {
  return getAuthUser()?.id ?? null;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) return redirect("/");
}

export async function checkEditAdAccess({ request }) {
  const url = new URL(request.url);
  const adId = url.searchParams.get("id");
  const token = getAuthToken();

  if (!token) return redirect("/");

  const userId = getAuthUserId();

  if (!userId) {
    return redirect("/");
  }

  try {
    const response = await fetch(`http://localhost:3000/backstagegear/ads/${adId}`);
    const resData = await response.json();

    if (resData[0].user_id !== userId) {
      throw new Error("Nincs jogosultságod a hirdetés szerkesztéséhez!");
    }
  } catch (err) {
    alert(err.message);
    return redirect("/");
  }

  return null;
}

export async function checkAdminAccess() {
  const token = getAuthToken();

  if (!token) return redirect("/");

  try {
    const response = await fetch("http://localhost:3000/backstagegear/me/is_admin",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      },
    );

    const resData = await response.json();

    if (!resData.is_admin)
      throw new Error("Nincs jogosultságod a hirdetés szerkesztéséhez!");
  } catch (err) {
    alert(err.message);
    return redirect("/");
  }

  return null;
}
