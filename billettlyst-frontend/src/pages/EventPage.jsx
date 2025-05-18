import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../sanityClient'
import './EventPage.css'

function EventPage() {
  const { id } = useParams()
  const [sanityEvent, setSanityEvent] = useState(null)
  const [ticketmasterData, setTicketmasterData] = useState(null)
  const [wishlistUsers, setWishlistUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
  const proxyUrl = 'https://api.allorigins.win/raw?url='

  useEffect(() => {
    async function fetchData() {
      try {
        // Hent event fra Sanity
        const sanityData = await client.fetch(
          `*[_type == "event" && _id == $id][0]`,
          { id }
        )

        if (!sanityData) {
          console.error("Fant ikke event i Sanity")
          setLoading(false)
          return
        }

        setSanityEvent(sanityData)

        // Hent kun brukere som har denne eventen i ønskeliste (ikke references generelt)
        const users = await client.fetch(
          `*[_type == "bruker" && $id in wishlist[]._ref]{
            name,
            image{asset->{url}}
          }`,
          { id }
        )
        setWishlistUsers(users)

        // Hent fra Ticketmaster
        const apiId = sanityData.apiId
        const ticketmasterUrl = `${proxyUrl}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${apiId}.json?apikey=${nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp}`
        )}`

        const res = await fetch(ticketmasterUrl)
        const ticketData = await res.json()
        setTicketmasterData(ticketData)
        setLoading(false)
      } catch (error) {
        console.error('Feil ved henting av data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <p>Laster data...</p>
  if (!sanityEvent || !ticketmasterData) return <p>Fant ikke event-data.</p>

  const { name, dates, _embedded, info, images, classifications, url } = ticketmasterData
  const genre = classifications?.[0]?.genre?.name
  const subGenre = classifications?.[0]?.subGenre?.name
  const city = _embedded?.venues?.[0]?.city?.name
  const country = _embedded?.venues?.[0]?.country?.name
  const date = dates?.start?.localDate
  const time = dates?.start?.localTime
  const artists = _embedded?.attractions?.map((artist) => artist.name)

  return (
    <div className="event-page">
      <h1>{name}</h1>

      {images?.[0]?.url && <img src={images[0].url} alt={name} />}

      <ul>
        <li><strong>Dato:</strong> {date} {time && `kl. ${time}`}</li>
        <li><strong>Sted:</strong> {city}, {country}</li>
        <li><strong>Sjanger:</strong> {genre} {subGenre && `– ${subGenre}`}</li>
        {artists?.length > 0 && (
          <li><strong>Artister:</strong> {artists.join(', ')}</li>
        )}
        {info && <li><strong>Info:</strong> {info}</li>}
      </ul>

      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="ticket-link">
          Kjøp billetter
        </a>
      )}

      {wishlistUsers.length > 0 && (
        <div className="wishlist-users">
          <h2>Hvem har dette i ønskeliste</h2>
          <div className="user-list">
            {wishlistUsers.map((user, i) => (
              <div key={i} className="wishlist-user">
                {user.image?.asset?.url && (
                  <img src={user.image.asset.url} alt={user.name} style={{ width: '80px', borderRadius: '50%' }} />
                )}
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPage
