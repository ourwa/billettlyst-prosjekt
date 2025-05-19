import { useEffect, useState } from 'react'
import client from '../sanityClient'
import { Link } from 'react-router-dom'
import './Dashboard.css' //importerer CSS-stil for dashboardet

function Dashboard() {
  //tilstand for innlogging
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [ticketmasterEvents, setTicketmasterEvents] = useState({})

  const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
  const proxyUrl = 'https://api.allorigins.win/raw?url='

  //henter brukerdata fra localStorage
  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    }
  }, [])

  //henter eventdetaljer fra Ticketmaster API basert på brukerens ønskeliste og kjøp
  useEffect(() => {
    if (!currentUser) return

    const allApiIds = [
      ...currentUser.wishlist.map(e => e.apiId),
      ...currentUser.previousPurchases.map(e => e.apiId)
    ]
    const uniqueApiIds = [...new Set(allApiIds)]

    async function fetchAllEvents() {
      const results = await Promise.all(
        uniqueApiIds.map(async (id) => {
          try {
            const res = await fetch(
              `${proxyUrl}${encodeURIComponent(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`)}`
            )
            const data = await res.json()
            return { id, data }
          } catch (err) {
            console.error('Feil ved henting:', id, err)
            return { id, data: null }
          }
        })
      )

      const mapped = {}
      results.forEach(({ id, data }) => {
        if (data) mapped[id] = data
      })
      setTicketmasterEvents(mapped)
    }

    fetchAllEvents()
  }, [currentUser])

  //håndterer innlogging ved å hente brukerdata fra Sanity
  const handleLogin = async (e) => {
    e.preventDefault()
    const user = await client.fetch(
      `*[_type == "bruker" && name == $name && email == $email][0]{
        _id,
        name,
        email,
        gender,
        age,
        image{asset->{url}},
        wishlist[]->{_id, title, apiId},
        previousPurchases[]->{_id, title, apiId},
        friends[]->{
          _id,
          name,
          image{asset->{url}},
          wishlist[]->{_id, title, apiId}
        }
      }`,
      { name, email }
    )

    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      alert('Bruker ikke funnet.')
    }
  }

  //logg ut bruker og fjern fra localStorage
  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  //viser innloggingsskjema hvis bruker ikke er logget inn
  if (!currentUser) {
    return (
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Logg inn</h2>
        <input
          type="text"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Logg inn</button>
      </form>
    )
  }

  return (
    <>
      <h1 className="min-side">Min side</h1> {/*overskrift for brukerens dashbord */}

      <div className="dashboard-layout">
        {/*seksjon: brukerinformasjon */}
        <div className="user-info">
          <h2>{currentUser.name}</h2>
          {currentUser.image?.asset?.url && (
            <img
              src={currentUser.image.asset.url}
              alt="Profilbilde"
              className="user-image"
            />
          )}
          <p>{currentUser.gender}</p>
          <p>{currentUser.age}</p>
          <p>{currentUser.email}</p>
          <p><strong>Ønskeliste:</strong> {currentUser.wishlist?.length || 0} arrangementer</p>
          <p><strong>Tidligere kjøp:</strong> {currentUser.previousPurchases?.length || 0} arrangementer</p>
          <button onClick={handleLogout}>Logg ut</button>
        </div>

        {/*seksjon:ønskeliste */}
        <div className="user-content">
          <div>
            <h3>Min ønskeliste</h3>
            {currentUser.wishlist?.map((e) => {
              const event = ticketmasterEvents[e.apiId]
              return (
                <div key={e._id}>
                  <h4>{event?.name || e.title}</h4>
                  {event?.images?.[0]?.url && (
                    <img src={event.images[0].url} alt={event.name} style={{ maxWidth: '200px' }} />
                  )}
                  <p>{event?.dates?.start?.localDate}</p>
                  <Link to={`/event/${e.apiId}`}>Se mer om dette kjøpet</Link>
                </div>
              )
            })}
          </div>

          {/*seksjon:tidligere kjøp */}
          <div>
            <h3>Min kjøp</h3>
            {currentUser.previousPurchases?.map((e) => {
              const event = ticketmasterEvents[e.apiId]
              return (
                <div key={e._id}>
                  <h4>{event?.name || e.title}</h4>
                  {event?.images?.[0]?.url && (
                    <img src={event.images[0].url} alt={event.name} style={{ maxWidth: '200px' }} />
                  )}
                  <p>{event?.dates?.start?.localDate}</p>
                  <Link to={`/event/${e.apiId}`}>Se mer om dette kjøpet</Link>
                </div>
              )
            })}
          </div>

          {/*seksjon:venner og felles arrangementer */}
          <div>
            <h3>Venner</h3>
            {currentUser.friends?.map((friend) => {
              const shared = currentUser.wishlist?.filter((w) =>
                friend.wishlist?.some((f) => f.apiId === w.apiId)
              )
              return (
                <div key={friend._id}>
                  {friend.image?.asset?.url && (
                    <img
                      src={friend.image.asset.url}
                      alt={friend.name}
                      className="friend-image"
                    />
                  )}
                  <p><strong>{friend.name}</strong></p>
                  {shared?.length > 0 &&
                    shared.map((event) => (
                      <p key={event._id}>
                        Du og {friend.name} ønsker begge å dra på <strong>
                          <Link to={`/event/${event.apiId}`}>{event.title}</Link>
                        </strong>
                      </p>
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
