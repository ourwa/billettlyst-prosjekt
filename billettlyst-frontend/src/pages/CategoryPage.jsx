import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CategoryPage.css'

const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const proxy = 'https://api.allorigins.win/raw?url='

function CategoryPage() {
  const { slug } = useParams()
  const [attraksjoner, setAttraksjoner] = useState([])
  const [arrangementer, setArrangementer] = useState([])
  const [spillesteder, setSpillesteder] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [search, setSearch] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterCountry, setFilterCountry] = useState('')

  useEffect(() => {
    async function fetchData() {
      const url = (keyword) =>
        `${proxy}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${API_KEY}&keyword=${keyword}&size=5`
        )}`
  
      try {
        const [arr, attr, venue] = await Promise.all([
          fetch(url(slug)).then((res) => res.json()),
          fetch(url('attraction')).then((res) => res.json()),
          fetch(url('venue')).then((res) => res.json()),
        ])
  
        console.log("Arrangementer", arr)
        console.log("Attraksjoner", attr)
        console.log("Spillesteder", venue)
  
        setArrangementer(arr._embedded?.attractions || [])
        setAttraksjoner(attr._embedded?.attractions || [])
        setSpillesteder(venue._embedded?.attractions || [])
      } catch (error) {
        console.error('Feil ved henting:', error)
      }
    }
  
    fetchData()
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
          {item.images?.[0]?.url && (
            <img src={item.images[0].url} alt={item.name} />
          )}
          <p>{item.name}</p>
          <button onClick={() => toggleWishlist(item.id)}>
            {isInWishlist(item.id) ? '❤️' : '🤍'}
          </button>
        </div>
      ))

  return (
    <div className="category-page">
      <h1>Kategori: {slug}</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Søk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="By"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Land"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </div>

      <section>
        <h2>Arrangementer</h2>
        <div className="card-list">{renderCards(arrangementer)}</div>
      </section>

      <section>
        <h2>Attraksjoner</h2>
        <div className="card-list">{renderCards(attraksjoner)}</div>
      </section>

      <section>
        <h2>Spillesteder</h2>
        <div className="card-list">{renderCards(spillesteder)}</div>
      </section>
    </div>
  )
}

export default CategoryPage
