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
        wishlist[]->{_id, title},
        previousPurchases[]->{_id, title},
        friends[]->{
          _id,
          name,
          wishlist[]->{_id, title}
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

  return (
    <div className="dashboard">
      {!currentUser ? (
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
      ) : (
        <div className="min-side">
          <h2>Min side</h2>
          <p>Velkommen, {currentUser.name}!</p>
          <p>E-post: {currentUser.email}</p>

          {currentUser.image?.asset?.url && (
            <img
              src={currentUser.image.asset.url}
              alt="Profilbilde"
              style={{ width: '120px', borderRadius: '50%', marginBottom: '1rem' }}
            />
          )}

          <button onClick={handleLogout}>Logg ut</button>

          <p>🎟 Tidligere kjøp: {currentUser.previousPurchases?.length || 0}</p>
          <ul>
            {currentUser.previousPurchases?.map((e) => (
              <li key={e._id}>
                <Link to={`/sanity-event/${e._id}`}>✔️ {e.title}</Link>
              </li>
            ))}
          </ul>

          <p>💖 Ønskeliste: {currentUser.wishlist?.length || 0}</p>
          <ul>
            {currentUser.wishlist?.map((e) => (
              <li key={e._id}>
                <Link to={`/sanity-event/${e._id}`}>🌟 {e.title}</Link>
              </li>
            ))}
          </ul>

          {currentUser.friends && currentUser.friends.length > 0 && (
            <div className="friends-section">
              <h3>Venner:</h3>
              {currentUser.friends.map((friend) => {
                const shared = currentUser.wishlist?.filter((e) =>
                  friend.wishlist?.some((f) => f._id === e._id)
                )

                return (
                  <div key={friend._id} style={{ marginBottom: '1rem' }}>
                    <p><strong>{friend.name}</strong></p>
                    {shared?.length > 0 &&
                      shared.map((e) => (
                        <p key={e._id}>
                          Du og {friend.name} har samme event i ønskelisten – hva med å dra sammen på <em>{e.title}</em>?
                        </p>
                      ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
