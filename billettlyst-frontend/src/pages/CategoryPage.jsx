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
    async function fetchData(type, setState) {
      const url = `${proxy}${encodeURIComponent(
        `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${API_KEY}&keyword=${slug}&size=5`
      )}`

      try {
        const res = await fetch(url)
        const data = await res.json()
        setState(data._embedded?.attractions || [])
      } catch (error) {
        console.error('Feil ved henting:', error)
      }
    }

    fetchData(slug, setArrangementer)
    fetchData('attraction', setAttraksjoner)
    fetchData('venue', setSpillesteder)
  }, [slug])

  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const isInWishlist = (itemId) => wishlist.includes(itemId)

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
        <div className="card-list">
          {arrangementer
            .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
            .map((a) => (
              <div className="card" key={a.id}>
                <p>{a.name}</p>
                <button onClick={() => toggleWishlist(a.id)}>
                  {isInWishlist(a.id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
        </div>
      </section>

      <section>
        <h2>Attraksjoner</h2>
        <div className="card-list">
          {attraksjoner.map((a) => (
            <div className="card" key={a.id}>
              <p>{a.name}</p>
              <button onClick={() => toggleWishlist(a.id)}>
                {isInWishlist(a.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Spillesteder</h2>
        <div className="card-list">
          {spillesteder.map((v) => (
            <div className="card" key={v.id}>
              <p>{v.name}</p>
              <button onClick={() => toggleWishlist(v.id)}>
                {isInWishlist(v.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CategoryPage
