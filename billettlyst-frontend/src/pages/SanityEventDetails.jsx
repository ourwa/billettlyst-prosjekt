import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../sanityClient'

const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const proxy = 'https://api.allorigins.win/raw?url='

function SanityEventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [ticketmasterData, setTicketmasterData] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchSanityEvent() {
      const sanityData = await client.fetch(
        `*[_type == "event" && _id == $id][0]`,
        { id }
      )
      setEvent(sanityData)

      if (sanityData?.apiId) {
        const url = `${proxy}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${sanityData.apiId}.json?apikey=${API_KEY}`
        )}`
        const res = await fetch(url)
        const ticketmaster = await res.json()
        setTicketmasterData(ticketmaster)

        // Fetch brukere som refererer til dette eventet
        const usersData = await client.fetch(
          `*[_type == "bruker" && (
            $ref in wishlist[]._ref || $ref in previousPurchases[]._ref
          )]{
            name,
            wishlist[]->{
              _id, title
            },
            previousPurchases[]->{
              _id, title
            }
          }`,
          { ref: sanityData._id }
        )
        setUsers(usersData)
      }
    }

    fetchSanityEvent()
  }, [id])

  if (!event) return <p>Laster arrangement...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{event.title}</h1>

      {ticketmasterData && (
        <>
          <p><strong>Sted:</strong> {
            ticketmasterData._embedded?.venues?.[0]?.city?.name
          }, {
            ticketmasterData._embedded?.venues?.[0]?.country?.name
          }</p>
          <p><strong>Dato:</strong> {
            ticketmasterData.dates?.start?.localDate
          }</p>
          <p><strong>Type:</strong> {
            ticketmasterData.classifications?.[0]?.genre?.name
          }</p>
        </>
      )}

      <h3>Brukere som har dette eventet:</h3>
      {users.map((user, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <p><strong>{user.name}</strong></p>
          {user.wishlist?.some(e => e._id === event._id) && (
            <p>💖 Ønskeliste</p>
          )}
          {user.previousPurchases?.some(e => e._id === event._id) && (
            <p>🎟 Tidligere kjøp</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default SanityEventDetails
