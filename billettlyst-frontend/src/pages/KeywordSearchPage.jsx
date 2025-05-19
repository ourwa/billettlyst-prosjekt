import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "./KeywordSearchPage.css";


const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const proxy = 'https://api.allorigins.win/raw?url='

function KeywordSearchPage() {
  const { keyword } = useParams()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&size=20`


      try {
        const res = await fetch(url)
        const data = await res.json()
        setEvents(data._embedded?.events || [])
      } catch (err) {
        console.error('Feil ved henting:', err)
      }
    }

    fetchEvents()
  }, [keyword])

  return (
    <div className="keyword-page">
      <h1>Søk Etter: {keyword}</h1>
      <div className="card-list">
        {events.map((event) => (
          <div className="card" key={event.id}>
            <img
              src={event.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image'}
              alt={event.name}
            />
            <h3>{event.name}</h3>
            <p>{event.dates?.start?.localDate}</p>
            <p>{event._embedded?.venues?.[0]?.name}</p>
            <div className="buttons">
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Kjøp
              </a>
              <button className="btn-secondary">Legg til i ønskeliste</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeywordSearchPage
