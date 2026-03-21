import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        Hill routes
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link to="/" className="nav-link">
          All routes
        </Link>
      </nav>
    </header>
  )
}
