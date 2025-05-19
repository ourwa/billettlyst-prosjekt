import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'
import './Home.css'

//ticketmaster API-nøkkel og proxy-URL
const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const proxy = 'https://api.allorigins.win/raw?url='

//fire spesifikke festivaler som skal vises først
const festivals = ['Findings', 'Neon', 'Skeikampenfestivalen', 'Tons of Rock']

//storbyer for dynamisk byvalg
const cities = ['Oslo', 'Berlin', 'London', 'Paris', 'Stockholm']

function Home() {
  const [events, setEvents] = useState([]) //lagre festivalene
  const [cityEvents, setCityEvents] = useState([]) // Lagre by-events
  const [selectedCity, setSelectedCity] = useState('Oslo') //forvalgt by

  //hent de fire forhåndsdefinerte festivalene fra Ticketmaster API
  useEffect(() => {
    async function fetchFestivals() {
      const fetched = await Promise.all(
        festivals.map(async (keyword) => {
          const url = `${proxy}${encodeURIComponent(
            `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&size=5`
          )}`
          try {
            const res = await fetch(url)
            const data = await res.json()
            return data._embedded?.events || []
          } catch (err) {
            console.error(err)
            return []
          }
        })
      )

      //begrens til maks 4 kort
      const limited = fetched.flat().slice(0, 4)
      setEvents(limited)
    }

    fetchFestivals()
  }, [])

  //funksjon for å hente arrangementer i valgt by
  const fetchCityEvents = async (city) => {
    setSelectedCity(city)
    const url = `${proxy}${encodeURIComponent(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${city}&size=10`
    )}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      setCityEvents(data._embedded?.events || [])
    } catch (err) {
      console.error('Feil ved henting av events fra by:', err)
      setCityEvents([])
    }
  }

  //når komponenten laster inn, hentes arrangementer for Oslo
  useEffect(() => {
    fetchCityEvents('Oslo')
  }, [])

  return (
    <div className="home">
      <h1>Sommerens festivaler</h1>
      
      {/*viser de fire valgte festivalene som EventCard */}
      <div className="festival-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} clickable={true} />
        ))}
      </div>

      <hr style={{ margin: '3rem 0' }} />
      
      <h2>Se hva som skjer i storbyene:</h2>
      
      {/*byknapper som filtrerer byvalg */}
      <div className="city-buttons">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => fetchCityEvents(city)}
            className={selectedCity === city ? 'active' : ''}
          >
            {city}
          </button>
        ))}
      </div>

      {/*viser arrangementer for valgt by */}
      {selectedCity && (
        <>
          <h3 style={{ marginTop: '2rem' }}>
            I {selectedCity} kan du oppleve:
          </h3>
          <div className="festival-grid">
            {cityEvents.map((event) => (
              <EventCard key={event.id} event={event} clickable={false} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
