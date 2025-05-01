import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TabBar.css';
import { auth } from '../firebase-config';

export default function TabBar() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'Utilisateur',
        email: user.email || 'Email inconnu',
      });
    }
  }, []);

  const userName = userInfo?.name.split(' ')[0] || 'Utilisateur';

  return (
    <nav className="navbar fixed-bottom bg-light border-top justify-content-around" style={{ width: '100dvw', paddingBottom: '30px', paddingTop: '10px' }}>
      <NavLink to="/home" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        🏠 Accueil
      </NavLink>
      <NavLink to="/Add" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        ➕ Ajouter
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        👤 {userName}
      </NavLink>
    </nav>
  );
}
