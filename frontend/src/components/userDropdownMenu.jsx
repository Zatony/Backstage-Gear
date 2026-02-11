import { Link, Form } from "react-router-dom";

export default function UserDropdownMenu({ userData, dropdownPos, logoutIcon, isAdmin, ref, onClose }) {
  return(
      <div ref={ref} className="user-dropdown" style={{top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px`}}>
        <div className="user-header">{userData.username}</div>
          <div className="userLine"></div>
            {!isAdmin &&
              <>
                <Link to="/my_profile" className="userMenuLink" onClick={onClose}>Profil</Link>
                <a className="userMenuLink" href="#">Üzenetek</a>
                <Link to="/my_ads" className="userMenuLink" onClick={onClose}>Hirdetéseim</Link>
                <Link to="/new_ad" className="userMenuLink" onClick={onClose}>Új hirdetés</Link>
              </>
            }
            {isAdmin &&
              <>
                 <Link to="/my_profile" className="userMenuLink" onClick={onClose}>Profil</Link>
                 <a className="userMenuLink" href="#">Üzenetek</a>
                 <Link to="/my_ads" className="userMenuLink" onClick={onClose}>Hirdetéseim</Link>
                 <Link to="/new_ad" className="userMenuLink" onClick={onClose}>Új hirdetés</Link>
                 <Link to="/reported_ads" className="userMenuLink" onClick={onClose}>Jelentett hirdetések</Link>
                 {/*<a className="userMenuLink" href="#">Jelentett felhasználók</a>*/}
              </>
            }
            <Form action="/logout" method="post" className="userMenuLogout" onSubmit={onClose}>
              <button type="submit" className="userMenuLogoutBtn"><img src={logoutIcon} alt="Logout"></img> Kilépés</button>
            </Form>
        </div>
    )
}