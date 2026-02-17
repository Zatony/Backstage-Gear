import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function getTokenDuration() {
  const storedDate = localStorage.getItem("expiration");
  const now = new Date();

  const duration = new Date(storedDate).getTime() - now.getTime();

  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const duration = getTokenDuration();
  if (duration < 0) {
    return "EXPIRED";
  }

  return token;
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

  const userId = jwtDecode(token).id;

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
