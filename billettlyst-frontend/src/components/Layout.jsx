import Header from './Header' //importerer toppmeny-komponenten
import { Outlet } from 'react-router-dom' //outlet brukes til å vise barnesider i ruter

function Layout() {
  return (
    <>
      <Header /> {/*viser toppmenyen på alle sider */}
      
      <main>
        <Outlet /> {/*her vises innholdet fra den aktive siden (Home, Category, osv.) */}
      </main>
      
      <footer
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#aaa',
          fontSize: '0.9rem'
        }}
      >
        {/*footer med henvisning til Ticketmaster API*/}
        Data provided by{' '}
        <a
          href="https://developer.ticketmaster.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ticketmaster API
        </a>
      </footer>
    </>
  )
}

export default Layout //eksporterer Layout slik at den kan brukes i rutene
