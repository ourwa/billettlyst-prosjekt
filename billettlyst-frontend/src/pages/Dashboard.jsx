// Dashboard.jsx

import { useEffect, useState } from 'react'
import client from '../sanityClient'
import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    }
  }, [])

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

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

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
    <div className="dashboard-layout">
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
        <button onClick={handleLogout}>Logg ut</button>
      </div>

      <div className="user-content">
        <div>
          <h3>Min ønskeliste</h3>
          {currentUser.wishlist?.map((e) => (
            <div key={e._id}>
              <p>{e.title}</p>
              <Link to={`/event/${e.apiId}`}>Se mer om dette kjøpet</Link>
            </div>
          ))}
        </div>
        <div>
          <h3>Min kjøp</h3>
          {currentUser.previousPurchases?.map((e) => (
            <div key={e._id}>
              <p>{e.title}</p>
              <Link to={`/event/${e.apiId}`}>Se mer om dette kjøpet</Link>
            </div>
          ))}
        </div>
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
  )
}

export default Dashboard
