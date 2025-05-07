import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './EventPage.css'

function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
  const proxyUrl = 'https://api.allorigins.win/raw?url='

  useEffect(() => {
    async function fetchEvent() {
      try {
        const url = `${proxyUrl}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`
        )}`

        const res = await fetch(url)
        const data = await res.json()
        setEvent(data)
        setLoading(false)
      } catch (error) {
        console.error('Feil ved henting av event:', error)
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) return <p>Laster data...</p>
  if (!event) return <p>Fant ikke event.</p>

  const { name, dates, _embedded, info, images, classifications, url } = event

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

      {images?.[0]?.url && (
        <img src={images[0].url} alt={name} />
      )}

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
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ticket-link"
        >
          Kjøp billetter
        </a>
      )}
    </div>
  )
}

export default EventPage
