import { NavLink } from 'react-router-dom';
import './TabBar.css';

export default function TabBar() {
  return (
    <nav className="navbar fixed-bottom bg-light border-top justify-content-around" style={{ width: '100dvw', paddingBottom: '30px', paddingTop: '10px' }}>
      <NavLink to="/home" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        🏠 Accueil
      </NavLink>
      <NavLink to="/Add" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        ➕ Ajouter
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-primary fw-bold' : 'text-muted'}>
        👤 Profil
      </NavLink>
    </nav>
  );
}
