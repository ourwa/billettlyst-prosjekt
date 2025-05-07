import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'

const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const festivals = ['Findings', 'Neon', 'Skeikampenfestivalen', 'Tons of Rock']

function Home() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function fetchEvents() {
      const proxyUrl = 'https://api.allorigins.win/raw?url='

      const fetched = await Promise.all(
        festivals.map(async (keyword) => {
          const url = `${proxyUrl}${encodeURIComponent(
            `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&size=1`
          )}`

          try {
            const res = await fetch(url)
            const data = await res.json()

            console.log("Keyword:", keyword)
            console.log("Data:", data)

            return data._embedded?.events?.[0] || null
          } catch (error) {
            console.error("Error fetching:", keyword, error)
            return null
          }
        })
      )

      setEvents(fetched.filter(Boolean))
    }

    fetchEvents()
  }, [])

  return (
    <div className="home">
      <h1>Utvalgte festivaler</h1>
      <div className="event-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default Home
