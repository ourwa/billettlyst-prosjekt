import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../sanityClient'
import './EventPage.css'

function EventPage() {
  const { apiId } = useParams()
  const [ticketmasterData, setTicketmasterData] = useState(null)
  const [wishlistUsers, setWishlistUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
  const proxyUrl = 'https://api.allorigins.win/raw?url='

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Hent data fra Ticketmaster
        const ticketmasterUrl = `${proxyUrl}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${apiId}.json?apikey=${API_KEY}`
        )}`
        const res = await fetch(ticketmasterUrl)
        const eventData = await res.json()
        setTicketmasterData(eventData)

       
        const users = await client.fetch(
          `*[_type == "bruker" && $apiId in wishlist[]->apiId]{
            name,
            email,
            image { asset->{url} }
          }`,
          { apiId }
        )
        setWishlistUsers(users)

      
        const stored = localStorage.getItem('currentUser')
        if (stored) {
          setCurrentUser(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Feil ved henting av data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiId])

  if (loading) return <p>Laster data...</p>
  if (!ticketmasterData) return <p>Fant ikke event-data.</p>

  const { name, dates, _embedded, info, images, classifications, url } = ticketmasterData
  const genre = classifications?.[0]?.genre?.name
  const subGenre = classifications?.[0]?.subGenre?.name
  const city = _embedded?.venues?.[0]?.city?.name
  const country = _embedded?.venues?.[0]?.country?.name
  const date = dates?.start?.localDate
  const time = dates?.start?.localTime
  const artists = _embedded?.attractions?.map((a) => a.name)
  

  const isInWishlist = currentUser?.wishlist?.some(e => e.apiId === apiId)
  const isInPurchases = currentUser?.previousPurchases?.some(e => e.apiId === apiId)

  return (
    <div className="event-page">
      <h1>{name}</h1>

      {images?.[0]?.url && (
        <img
          src={images[0].url}
          alt={name}
          style={{ width: '100%', maxWidth: '600px', borderRadius: '12px' }}
        />
      )}

      <ul>
        <li><strong>Dato:</strong> {date} {time && `kl. ${time}`}</li>
        <li><strong>Sted:</strong> {city}, {country}</li>
        <li><strong>Sjanger:</strong> {genre} {subGenre && `– ${subGenre}`}</li>
        {artists?.length > 0 && <li><strong>Artister:</strong> {artists.join(', ')}</li>}
        {info && <li><strong>Info:</strong> {info}</li>}
        </ul>
        {Array.isArray(ticketmasterData?.priceRanges) && ticketmasterData.priceRanges.length > 0 && (
  <div className="festivalpass" style={{ marginTop: '1.5rem' }}>
    <h2>Festivalpass</h2>
    <ul>
      {ticketmasterData.priceRanges.map((p, index) => (
        <li key={index}>
          <strong>{p.type || 'Billett'}:</strong>{' '}
          {p.min} – {p.max} {p.currency}
        </li>
      ))}
    </ul>
  </div>
)}

      

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ticket-link"
        >
          Kjøp billetter
        </a>
      )}

      {currentUser && (
        <div className="current-user-info" style={{ marginTop: '2rem' }}>
          <h2>Din informasjon</h2>
          <p><strong>Navn:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          {currentUser.image?.asset?.url && (
            <img
              src={currentUser.image.asset.url}
              alt={currentUser.name}
              style={{ width: '100px', borderRadius: '50%' }}
            />
          )}
          <p>{isInWishlist ? '✅ I ønskelisten' : '❌ Ikke i ønskelisten'}</p>
          <p>{isInPurchases ? '✅ Du har kjøpt dette' : '❌ Ikke kjøpt'}</p>
        </div>
      )}

      {wishlistUsers.length > 0 && (
        <div className="wishlist-users" style={{ marginTop: '2rem' }}>
          <h2>Andre brukere som ønsker dette</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {wishlistUsers.map((user, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                {user.image?.asset?.url && (
                  <img
                    src={user.image.asset.url}
                    alt={user.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                  />
                )}
                <p>{user.name}</p>
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPage
