import { useEffect, useState } from "react";
import profile from "./profile.module.css";
import { getAuthToken } from "../util/auth";

function ProfileField({ label, value }) {
  return (
    <div className={profile.profileField}>
      <span className={profile.profileFieldLabel}>{label}</span>
      <input className={profile.profileFieldInput} value={value} readOnly />
    </div>
  );
}

//ideiglenes
function formatHungarianPhone(input) {
  // Remove everything except digits
  let digits = input.replace(/\D/g, "");

  // Normalize prefix
  if (digits.startsWith("36")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("06")) {
    digits = digits.slice(2);
  }

  // Hungarian numbers should now be 9 digits
  if (digits.length !== 9) {
    return null; // invalid Hungarian phone number
  }

  const area = digits.slice(0, 2);
  const part1 = digits.slice(2, 5);
  const part2 = digits.slice(5);

  return `+36 ${area} ${part1} ${part2}`;
}

export default function Profile() {
  const token = getAuthToken();
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    pictureLink: "#",
    up_vote: 0,
    down_vote: 0
  });

  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      try{
        const response =  await fetch("http://localhost:3000/backstagegear/me/my_profile",{
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });

        const resData = await response.json();
        if(response.ok){
          setUserData({
            username: resData.username,
            phone: resData.phone_number,
            pictureLink: resData.profile_picture,
            up_vote: resData.up_votes,
            down_vote: resData.down_votes
          });
        }
      }
      catch(err){
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className={profile.profileContainer}>
      <h1 className={profile.profileTitle}>Profil szerkesztése</h1>

      <div className={profile.profileMain}>
        <div className={profile.profilePicture}>
          <img src={userData.pictureLink} alt="Profilkép" className={profile.profileImg} />
        </div>

        <div className={profile.profileFields}>
          <ProfileField label="Felhasználónév:" value={userData.username} />
          <ProfileField label="Telefonszám:" value={formatHungarianPhone(userData.phone)} />
          <ProfileField label="Profilkép:" value={userData.pictureLink} />
        </div>
      </div>

      <div className={profile.profileButtons}>
        <button className={profile.deleteButton}>Profil törlése</button>
        <button className={profile.changePasswordButton}>Jelszó módosítása</button>
        <button className={profile.changeDataButton}>Adatok módosítása</button>
      </div>
    </div>
  );
}
