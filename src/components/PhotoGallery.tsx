interface Props {
  images: { src: string; alt: string }[]
}

export function PhotoGallery({ images }: Props) {
  if (images.length === 0) return null

  return (
    <section className="photo-section" aria-labelledby="photos-heading">
      <h2 id="photos-heading" className="section-title">
        Photos
      </h2>
      <ul className="photo-grid">
        {images.map((img) => (
          <li key={img.src} className="photo-item">
            <a href={img.src} target="_blank" rel="noreferrer" className="photo-link">
              <img src={img.src} alt={img.alt} loading="lazy" className="photo-img" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
