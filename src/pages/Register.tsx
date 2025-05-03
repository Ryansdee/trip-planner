import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase-config';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez vérifier vos informations.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Erreur avec Google. Veuillez réessayer.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        width: '100vw',
      }}
    >
      <div className="card p-5 shadow-lg" style={{ borderRadius: '20px', maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src="/TRIP.png" alt="Logo" width="180" />
          <h3 className="mt-3 text-dark fw-bold">Créer un compte</h3>
          <p className="text-muted small">Commencez votre aventure dès maintenant</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailRegister}>
          <div className="form-group mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-envelope-fill text-secondary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Adresse e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock-fill text-secondary"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 mb-3 shadow-sm">
            S'inscrire
          </button>
        </form>

        <div className="text-center my-2 text-muted">ou</div>

        <button onClick={handleGoogleRegister} className="btn btn-outline-danger w-100 shadow-sm">
          <i className="bi bi-google me-2"></i> S'inscrire avec Google
        </button>

        <div className="text-center mt-4">
          <span className="text-muted small">Vous avez déjà un compte ? </span>
          <Link to="/" className="text-primary text-decoration-none">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
