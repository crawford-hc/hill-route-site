import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main" id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
