import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CategoryPage.css'

const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'

const segmentMap = {
  musikk: 'Music',
  sport: 'Sports',
  teater: 'Arts & Theatre',
  show: 'Arts & Theatre',
  festival: 'Music'
}

const cityMap = {
  NO: ['Oslo', 'Bergen', 'Trondheim'],
  SE: ['Stockholm', 'Skellefteå', 'Linköping'],
  DK: ['København V', 'Aarhus C', 'Odense C']
}

function CategoryPage() {
  const { slug } = useParams()
  const [events, setEvents] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterCity, setFilterCity] = useState('')

  const fetchFilteredEvents = async () => {
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

    const url = `/api/discovery/v2/events.json?${params}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      setEvents(data._embedded?.events || [])
    } catch (error) {
      console.error('Error fetching filtered events:', error)
    }
  }

  useEffect(() => {
    fetchFilteredEvents()
  }, [slug])

  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const isInWishlist = (itemId) => wishlist.includes(itemId)

  const renderCards = (items) =>
    items
      .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()))
      .map((item) => (
        <div className="card" key={item.id}>
          <img
            src={item.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image'}
            alt={item.name}
          />
          <h3>{item.name}</h3>
          <p>{item.dates?.start?.localDate}</p>
          <p>
            {item._embedded?.venues?.[0]?.city?.name},{' '}
            {item._embedded?.venues?.[0]?.country?.name}
          </p>
          <button onClick={() => toggleWishlist(item.id)}>
            {isInWishlist(item.id) ? '❤️' : '🤍'}
          </button>
        </div>
      ))

  return (
    <div className="category-page">
      <h1>{slug}</h1>

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
              const country = e.target.value
              setFilterCountry(country)
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

        <button onClick={fetchFilteredEvents}>Filtrer</button>
      </div>

      <div className="search-bar">
        <label>
          Søk etter event, attraksjon eller spillested
          <input
            type="text"
            placeholder="Søk Event"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
       
      </div>

      <section>
        <h2>Resultater</h2>
        {events.length === 0 ? (
          <p>Ingen resultater funnet. Prøv andre filtre eller dato.</p>
        ) : (
          <div className="card-list">{renderCards(events)}</div>
        )}
      </section>
    </div>
  )
}

export default CategoryPage
