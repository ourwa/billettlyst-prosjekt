import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../sanityClient'

// API nøkkel 
const API_KEY = 'nWMG0qUTjpgAf9AvHEWupFaZr6t3lGJp'
const proxy = 'https://api.allorigins.win/raw?url='

function SanityEventDetails() {
  const { id } = useParams() //henter Sanity-ID fra URL
  const [event, setEvent] = useState(null) //sanity event data
  const [ticketmasterData, setTicketmasterData] = useState(null) //ekstra info fra Ticketmaster
  const [users, setUsers] = useState([]) //brukere som har dette eventet

  useEffect(() => {
    async function fetchSanityEvent() {
      //henter arrangementet fra Sanity basert på id
      const sanityData = await client.fetch(
        `*[_type == "event" && _id == $id][0]`,
        { id }
      )
      setEvent(sanityData)

      //henter detaljer fra Ticketmaster hvis apiId finnes
      if (sanityData?.apiId) {
        const url = `${proxy}${encodeURIComponent(
          `https://app.ticketmaster.com/discovery/v2/events/${sanityData.apiId}.json?apikey=${API_KEY}`
        )}`
        const res = await fetch(url)
        const ticketmaster = await res.json()
        setTicketmasterData(ticketmaster)

        //henter brukere som har dette eventet i ønskeliste eller tidligere kjøp
        const usersData = await client.fetch(
          `*[_type == "bruker" && (
            $ref in wishlist[]._ref || $ref in previousPurchases[]._ref
          )]{
            name,
            wishlist[]->{ _id, title },
            previousPurchases[]->{ _id, title }
          }`,
          { ref: sanityData._id }
        )
        setUsers(usersData)
      }
    }

    fetchSanityEvent()
  }, [id])

  //viser lasteindikator hvis data ikke er klart
  if (!event) return <p>Laster arrangement...</p>

  return (
    <div style={{ padding: '2rem' }}>
      {/*tittel fra Sanity */}
      <h1>{event.title}</h1>

      {/*ticketmaster-detaljer om tilgjengelig */}
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

      {/*liste over brukere som har dette eventet */}
      <h3>Brukere som har dette eventet:</h3>
      {users.map((user, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <p><strong>{user.name}</strong></p>

          {/*sjekker om eventet finnes i ønskelisten */}
          {user.wishlist?.some(e => e._id === event._id) && (
            <p>💖 Ønskeliste</p>
          )}

          {/*sjekker om eventet finnes i tidligere kjøp */}
          {user.previousPurchases?.some(e => e._id === event._id) && (
            <p>🎟 Tidligere kjøp</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default SanityEventDetails
