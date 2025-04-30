import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase-config'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Email ou mot de passe invalide')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError('Erreur avec Google')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Se connecter</button>
        </form>

        <hr className="divider" />
        <button onClick={handleGoogleLogin} className="google-button">
          Connexion avec Google
        </button>
      </div>
    </div>
  )
}
