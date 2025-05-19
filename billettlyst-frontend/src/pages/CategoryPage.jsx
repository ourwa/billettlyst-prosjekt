import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CategoryPage.css'

//API nøkkelen for Ticketmaster
const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'

//map mellom URLslug og Ticketmaster segmentnavn
const segmentMap = {
  musikk: 'Music',
  sport: 'Sports',
  teater: 'Arts & Theatre',
  show: 'Arts & Theatre',
  festival: 'Music'
}

//forhåndsdefinerte byer per land brukt i by filteret
const cityMap = {
  NO: ['Oslo', 'Bergen', 'Trondheim'],
  SE: ['Stockholm', 'Skellefteå', 'Linköping'],
  DK: ['København V', 'Aarhus C', 'Odense C']
}

function CategoryPage() {
  const { slug } = useParams() // henter kategorien fra URL
  const [events, setEvents] = useState([])
  const [attractions, setAttractions] = useState([])
  const [venues, setVenues] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [shouldFilter, setShouldFilter] = useState(false) //flagg for å kontrollere når filtrering skal skje

  //henter arrangementer, attraksjoner og spillesteder fra API
  const fetchAllData = async () => {
    const segment = segmentMap[slug?.toLowerCase()] || ''
    const dateFrom = filterDate && `${filterDate}T00:00:00Z`
    const dateTo = filterDate && `${filterDate}T23:59:59Z`

    const params = [
      `apikey=${API_KEY}`,
      segment && `segmentName=${encodeURIComponent(segment)}`,
      dateFrom && `startDateTime=${dateFrom}`,
      dateTo && `endDateTime=${dateTo}`,
      filterCity && `city=${filterCity}`,
      filterCountry && `countryCode=${filterCountry}`,
      'size=20',
      'sort=date,asc'
    ].filter(Boolean).join('&')

    try {
      // henter arrangementer
      const eventsRes = await fetch(`/api/discovery/v2/events.json?${params}`)
      const eventsData = await eventsRes.json()
      setEvents(eventsData._embedded?.events || [])

      //henter attraksjoner via suggest-endepunktet
      const suggestRes = await fetch(`/api/discovery/v2/suggest.json?apikey=${API_KEY}&keyword=${slug}`)
      const suggestData = await suggestRes.json()
      setAttractions(suggestData._embedded?.attractions || [])

      //henter spillesteder
      const venueRes = await fetch(`/api/discovery/v2/venues.json?apikey=${API_KEY}&countryCode=${filterCountry || 'NO'}&size=10`)
      const venueData = await venueRes.json()
      setVenues(venueData._embedded?.venues || [])

    } catch (error) {
      console.error('Feil ved henting av data:', error)
    }
  }

  //kjør fetch når slug endres
  useEffect(() => {
    fetchAllData()
  }, [slug])

  //kjør fetch når bruker trykker på Filtrer
  useEffect(() => {
    if (shouldFilter) {
      fetchAllData()
      setShouldFilter(false)
    }
  }, [shouldFilter])

  //legg til/fjern element fra ønskelisten
  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  // sjekk om et item er i ønskelisten
  const isInWishlist = (itemId) => wishlist.includes(itemId)

  //funksjon for å vise cards (eventer, attraksjoner, spillesteder)
  const renderCards = (items, type) =>
    items
      .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()))
      .map((item) => (
        <div className="card" key={item.id}>
          <img
            src={item.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image'}
            alt={item.name}
          />
          <h3 title={item.name}>{item.name}</h3>

          {/*viser dato og sted for eventer */}
          {type === 'event' && (
            <>
              <p>{item.dates?.start?.localDate}</p>
              <p>
                {item._embedded?.venues?.[0]?.city?.name},{' '}
                {item._embedded?.venues?.[0]?.country?.name}
              </p>
            </>
          )}

          {/*viser sted for venues */}
          {type === 'venue' && (
            <p>
              {item.city?.name}, {item.country?.name}
            </p>
          )}

          {/*ønskeliste-ikon */}
          <button onClick={() => toggleWishlist(item.id)}>
            {isInWishlist(item.id) ? '❤️' : '🤍'}
          </button>
        </div>
      ))

  return (
    <div className="category-page">
      <h1>{slug}</h1>

      {/*filterseksjonen */}
      <div className="filters">
        <label>
          Dato:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>

        <label>
          Land:
          <select
            value={filterCountry}
            onChange={(e) => {
              setFilterCountry(e.target.value)
              setFilterCity('')
            }}
          >
            <option value="">Velg et land</option>
            <option value="NO">Norge</option>
            <option value="SE">Sverige</option>
            <option value="DK">Danmark</option>
          </select>
        </label>

        <label>
          By:
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            disabled={!filterCountry}
          >
            <option value="">Velg en by</option>
            {filterCountry &&
              cityMap[filterCountry].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
          </select>
        </label>

        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={() => setShouldFilter(true)}>Filtrer</button>
        </div>
      </div>

      {/*søkeseksjon */}
      <div className="search-bar">
        <label>
          Søk etter event, attraksjon eller spillested
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Søk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchAllData}>Søk</button>
          </div>
        </label>
      </div>

      {/*seksjon for arrangementer */}
      <section>
        <h2>Arrangementer</h2>
        <div className="card-list">{renderCards(events, 'event')}</div>
      </section>

      {/*seksjon for attraksjoner*/}
      <section>
        <h2>Attraksjoner</h2>
        <div className="card-list">{renderCards(attractions, 'attraction')}</div>
      </section>

      {/*seksjon for spillesteder */}
      <section>
        <h2>Spillesteder</h2>
        <div className="card-list">{renderCards(venues, 'venue')}</div>
      </section>
    </div>
  )
}

export default CategoryPage
