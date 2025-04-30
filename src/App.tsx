import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase-config'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Add from './pages/Add'

// Import de react-dnd pour le drag-and-drop
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement...</div>
  }

  return (
    <DndProvider backend={HTML5Backend}> {/* Ajout du DndProvider pour activer le drag-and-drop */}
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/add" element={user ? <Add /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </DndProvider>
  )
}

export default App
