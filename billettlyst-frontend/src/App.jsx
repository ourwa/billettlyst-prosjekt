import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import EventPage from './pages/EventPage'
import CategoryPage from './pages/CategoryPage'
import Dashboard from './pages/Dashboard'
import SanityEventDetails from './pages/SanityEventDetails'
import Header from './components/Header'
import Layout from './components/Layout'


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:apiId" element={<EventPage />} />

        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sanity-event/:id" element={<SanityEventDetails />} />
        <Route path="*" element={<Layout />} />
      </Routes>
    </Router>
  )
}

export default App
