import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Home from './pages/Home'
import EventPage from './pages/EventPage'
import CategoryPage from './pages/CategoryPage'
import Dashboard from './pages/Dashboard'
import SanityEventDetails from './pages/SanityEventDetails'
import Layout from './components/Layout'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event/:apiId" element={<EventPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sanity-event/:id" element={<SanityEventDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
