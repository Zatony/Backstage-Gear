import userIco from '../assets/userIcon.png';
import shoppingCart from '../assets/shoppingCart.png';

export default function NavBar() {
    return (
        <nav className="navbar">
            <h3 className="logo">Backstage Gear</h3>
            <div className='navbarLine'></div>
            <ul className="nav-links">
                <li><a href="#">Rólunk</a></li>
                <li><a href="#">Szabályzat</a></li>
            </ul>

            <img className="profile" src={userIco} alt="Profile"></img>
            <img className="cart" src={shoppingCart} alt="Cart"></img>
        </nav>
    )
}