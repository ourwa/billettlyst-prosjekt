import './ArtistCard.css'

function ArtistCard({ artist }) {
  if (!artist) return null

  return (
    <div className="artist-card">
      {artist.image && (
        <img src={artist.image} alt={artist.name} className="artist-image" />
      )}
      <h4>{artist.name}</h4>
      {artist.genre && <p>{artist.genre}</p>}
    </div>
  )
}

export default ArtistCard
