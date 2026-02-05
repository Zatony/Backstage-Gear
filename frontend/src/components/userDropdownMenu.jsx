import { Link } from "react-router-dom";

export default function UserDropdownMenu({ userData, dropdownPos, handleLogout, logoutIcon, isAdmin}) {
    return(
        <div className="user-dropdown" style={{top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px`}}>
            <div className="user-header">{userData.username}</div>
            <div className="userLine"></div>
            {!isAdmin &&
                <>
                    <a className="userMenuLink" href="#">Profil</a>
                    <a className="userMenuLink" href="#">Üzenetek</a>
                    <Link to="/my_ads" className="userMenuLink">Hirdetések</Link>
                    <a className="userMenuLink" href="#">Új hirdetés</a>
                </>
            }
            {isAdmin &&
                <>
                    <a className="userMenuLink" href="#">Profil</a>
                    <a className="userMenuLink" href="#">Üzenetek</a>
                    <a className="userMenuLink" href="#">Hirdetések</a>
                    <a className="userMenuLink" href="#">Új hirdetés</a>
                    <a className="userMenuLink" href="#">Jelentett hirdetés</a>
                    <a className="userMenuLink" href="#">Jelentett felhasználók</a>
                </>
            }
            <a className="userMenuLogout"  onClick={handleLogout}><img src={logoutIcon} alt="Logout"></img> Kilépés</a>
        </div>
    )
}