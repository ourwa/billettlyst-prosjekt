import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EventPage from './pages/EventPage'
import CategoryPage from './pages/CategoryPage'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Header'
import SanityEventDetails from './pages/SanityEventDetails'
import Layout from './components/Layout'
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sanity-event/:id" element={<SanityEventDetails />} />
        <Route path="/" element={<Layout />}></Route>
      </Routes>
    </Router>
  )
}

export default App
