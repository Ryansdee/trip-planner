import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase-config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Email ou mot de passe invalide');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Erreur avec Google');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-3">
          <img src="/TRIP.png" alt="Logo" width="200" />
          <h2>Connexion</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-2">Se connecter</button>
        </form>

        <div className="text-center my-2">
          <span>ou</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn btn-outline-danger w-100">
          Connexion avec Google
        </button>
      </div>
    </div>
  );
}
