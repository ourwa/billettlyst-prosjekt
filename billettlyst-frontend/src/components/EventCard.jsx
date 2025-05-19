import { Link } from 'react-router-dom' //importerer Link for navigasjon mellom sider
import './EventCard.css' //importerer CSS for EventCard-komponenten

function EventCard({ event, clickable = true }) {
  //henter ut relevante data fra event-objektet
  const name = event.name
  const image = event.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image' //viser bilde hvis det finnes, ellers et standardbilde
  const date = event.dates?.start?.localDate
  const city = event._embedded?.venues?.[0]?.city?.name
  const country = event._embedded?.venues?.[0]?.country?.name

  return (
    <div className="event-card"> {/*container for hele eventkortet */}
      <img src={image} alt={name} /> {/*event-bilde */}
      <h3>{name}</h3> {/*navn på arrangementet */}
      <p>{date}</p> {/* Dato */}
      <p>{city}, {country}</p> {/*sted (by og land) */}

      {clickable && (
        <Link className="btn" to={`/event/${event.id}`}>
          Les mer om {name} {/*navigasjonsknapp til EventPage */}
        </Link>
      )}
    </div>
  )
}

export default EventCard //eksporterer komponenten 
