import { Link } from 'react-router-dom'
import './Navbar.css' 

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Billettlyst</Link>
      <ul className="nav-links">
        <li><Link to="/category/musikk">Musikk</Link></li>
        <li><Link to="/category/sport">Sport</Link></li>
        <li><Link to="/category/teater">Teater</Link></li>
        <li><Link to="/dashboard">Login</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
