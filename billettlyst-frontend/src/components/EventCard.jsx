import { Link } from 'react-router-dom'
import './EventCard.css'

function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.images?.[0]?.url} alt={event.name} />
      <h3>{event.name}</h3>
      <p>{event.dates?.start?.localDate}</p>
      <p>{event._embedded?.venues?.[0]?.city?.name}, {event._embedded?.venues?.[0]?.country?.name}</p>
      <Link to={`/event/${event.id}`} className="details-button">Se detaljer</Link>
    </div>
  )
}

export default EventCard
