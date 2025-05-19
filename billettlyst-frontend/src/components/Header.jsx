import { Link } from 'react-router-dom'
import './Header.css'

function Header({ currentUser }) {
  return (
    <header className="main-header">
      <Link to="/" className="logo">Billettlyst</Link>
      <nav>
        <Link to="/category/musikk">Musikk</Link>
        <Link to="/category/sport">Sport</Link>
        <Link to="/category/teater">Teater</Link>
        {currentUser ? (
          <Link to="/dashboard">Min side</Link>
        ) : (
          <Link to="/dashboard">Login</Link>
        )}
      </nav>
    </header>
  )
}

export default Header
