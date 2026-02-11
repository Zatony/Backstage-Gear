import { useEffect, useState } from "react";
import reportedAds from "./reportedAds.module.css";
import { getAuthToken } from "../util/auth";
import ReportedAd from "../components/reportedAd";

export default function ReportedAds() {
  const [reports, setReports] = useState([]);
  const token = getAuthToken();

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/reported_ads", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Hiba a jelentett hirdetések lekérésekor:", err);
      }
    }
    fetchReports();
  }, [token]);

  return (
    <div className={reportedAds.reportedAdsContainer}>
      <h1 className={reportedAds.reportedAdsTitle}>Jelentett hirdetések</h1>
      <div className={reportedAds.reportedAdsLine}></div>

      {reports.length === 0 && (
        <div className={reportedAds.noReports}>Nincsenek jelentett hirdetések.</div>
      )}

      {reports.map((report) => (
        <ReportedAd key={`${report.id}_${report.name}`} adId={report.id} page={reportedAds} />
      ))}
    </div>
  );
}
