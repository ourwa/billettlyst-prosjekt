import './ArtistCard.css' //importerer stilarket for ArtistCard-komponenten

function ArtistCard({ artist }) {
  if (!artist) return null //hvis artist ikke er definert, vises ingenting

  return (
    <div className="artist-card"> {/*hovedcontainer for artistkortet */}
      {artist.image && (
        <img
          src={artist.image}
          alt={artist.name}
          className="artist-image"
        /> //viser artistens bilde hvis det finnes
      )}
      <h4>{artist.name}</h4> {/*viser artistens navn */}
      {artist.genre && <p>{artist.genre}</p>} {/* Viser sjanger hvis den finnes */}
    </div>
  )
}

export default ArtistCard //eksporterer komponenten 
