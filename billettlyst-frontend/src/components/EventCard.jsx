import { Link } from 'react-router-dom'
import './EventCard.css'

function EventCard({ event, clickable = true }) {
  const name = event.name
  const image = event.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image'
  const date = event.dates?.start?.localDate
  const city = event._embedded?.venues?.[0]?.city?.name
  const country = event._embedded?.venues?.[0]?.country?.name

  return (
    <div className="event-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{date}</p>
      <p>{city}, {country}</p>

      {clickable && (
        <Link className="btn" to={`/event/${event.id}`}>
          Les mer om {name}
        </Link>
      )}
    </div>
  )
}

export default EventCard
