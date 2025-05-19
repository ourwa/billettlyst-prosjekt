import { Link } from 'react-router-dom' //importerer Link-komponenten for navigasjon
import './Header.css' //importerer stilark for headeren

function Header({ currentUser }) {
  return (
    <header className="main-header"> {/*hovedcontainer for toppmenyen */}
      <Link to="/" className="logo">Billettlyst</Link> {/*logoen lenker til forsiden */}
      
      <nav> {/*navigasjonsmeny */}
        <Link to="/category/musikk">Musikk</Link> {/*lenke til musikk-kategori */}
        <Link to="/category/sport">Sport</Link>   {/*lenke til sport-kategori */}
        <Link to="/category/teater">Teater</Link> {/*lenke til teater-kategori */}

        {/*viser "Min side" hvis brukeren er innlogget, ellers "Login" */}
        {currentUser ? (
          <Link to="/dashboard">Min side</Link>
        ) : (
          <Link to="/dashboard">Login</Link>
        )}
      </nav>
    </header>
  )
}

export default Header //eksporterer komponenten 
