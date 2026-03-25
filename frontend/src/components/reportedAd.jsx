import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";
import { formatHungarianPhone } from "../util/phoneUtils";

export default function ReportedAd({ adId, page }) {
  const [report, setReport] = useState([]);
  const [userData, setUserData] = useState([]);
  const token = getAuthToken();

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`http://localhost:3000/backstagegear/me/reported_ads/${adId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          });

        if (response.ok) {
          const resData = await response.json();
          setReport(resData[0]);
        }
      } catch (err) {
        console.error("Hiba a jelentett hirdetés lekérésekor:", err);
      }
    }

    fetchReport();
  }, [adId, token]);

  useEffect(() => {
    async function fetchUserData() {
      if(!report || report.user_id === undefined)
        return;

      // console.log(report.user_id)

      try {
        const response = await fetch(`http://localhost:3000/backstagegear/profiles/${report.user_id}`);

        if (response.ok){
            const resData = await response.json();
            setUserData(resData);
        } 
      } catch (err) {
        console.error("Hiba a felhasználói adatok lekérésekor: ", err);
      }
    }

    fetchUserData();
  }, [report]);

  async function handleDeleteAd(adId) {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a hirdetést?")) 
        return;
    try {
      const response = await fetch(`http://localhost:3000/backstagegear/me/reported_ads/${adId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

      if (response.ok) {
        setReport(null);
      }
    } catch (err) {
      console.error("Hiba a hirdetés törlésekor:", err);
    }
  }

  async function handleDeleteUser(userId) {
    // console.log("Törlendő user ID: ", userId);
    if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?"))
      return;
    // console.log("Törlés megerősítve, végrehajtás...");
    try {
      const response = await fetch(`http://localhost:3000/backstagegear/me/delete_user/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        // console.log("Felhasználó törlésének válasza: ", response);
      if (response.ok) {
        setReport(null);
      }
      // else
        // console.log(response)
    } catch (err) {
      console.error("Hiba a felhasználó törlésekor:", err);
    }
  }

  async function handleDismissReport(reportId) {
    if (!window.confirm("Biztosan visszavonod ezt a jelentést?"))
      return;
    try {
      const response = await fetch(`http://localhost:3000/backstagegear/me/reported_ads/${reportId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
      if (response.ok) {
        setReport(null);
      }
    } catch (err) {
      console.error("Hiba a jelentés törlésekor:", err);
    }
  }

  if (!report) 
    return null;

  return (
    <div key={adId} className={page.reportedAdCard}>
      <div className={page.adImageSection}>
        <img
          src={report.files}
          alt={report.item_name}
          className={page.adImage}
        />
      </div>

      <div className={page.adInfoSection}>
        <h3 className={page.adTitle}>{report.item_name}</h3>
        <p className={page.adDescription}>{report.description}</p>

        <div className={page.userSection}>
          <img
            src={userData.profile_picture}
            alt={userData.username}
            className={page.userIcon}
          />
          <div className={page.userInfo}>
            <span className={page.userName}>
              {userData.username}
            </span>
            <span className={page.userContact}>
              E-mail cím: {report.email}
            </span>
            <span className={page.userContact}>
              Telefonszám: {formatHungarianPhone(userData.phone_number)}
            </span>
          </div>
        </div>
      </div>

      <div className={page.actionsSection}>
        <button
          className={page.deleteAdBtn}
          onClick={() => handleDeleteAd(report.id)}
        >
          Hirdetés törlése
        </button>
        <button
          className={page.deleteUserBtn}
          onClick={() => handleDeleteUser(report.user_id)}
        >
          Felhasználó törlése
        </button>
        <button
          className={page.dismissBtn}
          onClick={() => handleDismissReport(report.id)}
        >
          Visszavonás 
        </button>
      </div>
    </div>
  );
}
