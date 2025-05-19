import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../sanityClient'
import './EventPage.css'

function EventPage() {
  const { apiId } = useParams()
  const [ticketmasterData, setTicketmasterData] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
  const proxyUrl = 'https://api.allorigins.win/raw?url='

  useEffect(() => {
    async function fetchData() {
      try {
        const ticketmasterUrl = `${proxyUrl}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${apiId}.json?apikey=${API_KEY}`
        )}`
        const res = await fetch(ticketmasterUrl)
        const eventData = await res.json()
        setTicketmasterData(eventData)
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

  const { name, classifications, images, _embedded, dates, priceRanges } = ticketmasterData
  const genres = classifications?.map(c => [c.segment?.name, c.genre?.name, c.subGenre?.name]).flat().filter(Boolean)
  const venue = _embedded?.venues?.[0]?.name || 'Ukjent sted'
  const eventDate = dates?.start?.localDate || 'Ukjent dato'

  return (
    <div className="event-page">
      <h1>{name}</h1>

      <section>
        <h2 style={{ marginBottom: '0.5rem' }}>Sjanger:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          {genres?.length > 0 ? genres.map((g, idx) => (
            <span key={idx}>{g}</span>
          )) : <span>Ukjent</span>}
        </div>
      </section>

      <section>
        <h3>Følg oss på sosiale medier:</h3>
        <div style={{ marginBottom: '2rem' }}>
          {/* Icons can be added here */}
        </div>
      </section>

      {Array.isArray(priceRanges) && priceRanges.length > 0 && (
        <section>
          <h3>Festivalpass:</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {priceRanges.map((p, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '8px',
                maxWidth: '280px',
                color: 'black'
              }}>
                <img
                  src={images?.[0]?.url}
                  alt={name}
                  style={{ width: '100%', borderRadius: '6px', marginBottom: '1rem' }}
                />
                <h4>{name} - {p.type || 'Festivalpass'}</h4>
                <p>{venue}</p>
                <p>{eventDate}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button style={{ padding: '0.5rem 1rem' }}>Kjøp</button>
                  <button style={{ padding: '0.5rem 1rem' }}>Legg til i ønskeliste</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default EventPage
