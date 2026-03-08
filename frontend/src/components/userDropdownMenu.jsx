import { useEffect, useState } from "react";
import { Link, Form } from "react-router-dom";
import { getAuthToken } from "../util/auth";

export default function UserDropdownMenu({ userData, dropdownPos, logoutIcon, ref, onClose }) {
  const token = getAuthToken();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchIsAdmin() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/is_admin", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            }
          });

        if (response.ok) {
          const resData = await response.json();
          setIsAdmin(resData.is_admin);
        }
      } catch (err) {
        console.error("Hiba történt az admin státusz lekérése során: ", err);
      }
    }
    fetchIsAdmin();
  }, []);
  return(
      <div ref={ref} className="user-dropdown" style={{top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px`}}>
        <div className="user-header">{userData.username}</div>
          <div className="userLine"></div>
            {!isAdmin &&
              <>
                <Link to="/my_profile" className="userMenuLink" onClick={onClose}>Profil</Link>
                <Link to="/message" className="userMenuLink" onClick={onClose}>Üzenetek</Link>
                <Link to="/my_ads" className="userMenuLink" onClick={onClose}>Hirdetéseim</Link>
                <Link to="/new_ad" className="userMenuLink" onClick={onClose}>Új hirdetés</Link>
              </>
            }
            {isAdmin &&
              <>
                 <Link to="/my_profile" className="userMenuLink" onClick={onClose}>Profil</Link>
                 <Link to="/message" className="userMenuLink" onClick={onClose}>Üzenetek</Link>
                 <Link to="/my_ads" className="userMenuLink" onClick={onClose}>Hirdetéseim</Link>
                 <Link to="/new_ad" className="userMenuLink" onClick={onClose}>Új hirdetés</Link>
                 <Link to="/reported_ads" className="userMenuLink" onClick={onClose}>Jelentett hirdetések</Link>
              </>
            }
            <Form action="/logout" method="post" className="userMenuLogout" onSubmit={onClose}>
              <button type="submit" className="userMenuLogoutBtn"><img src={logoutIcon} alt="Logout"></img> Kilépés</button>
            </Form>
        </div>
    )
}