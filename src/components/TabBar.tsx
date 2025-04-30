import { NavLink } from 'react-router-dom'
import './TabBar.css'

export default function TabBar() {
  return (
    <div className="tabbar">
      <NavLink to="/home" className={({isActive}) => isActive ? "tabbar-item active" : "tabbar-item"}>🏠 Accueil</NavLink>
      <NavLink to="/Add" className={({isActive}) => isActive ? "tabbar-item active" : "tabbar-item"}>➕ Ajouter</NavLink>
      <NavLink to="/profile" className={({isActive}) => isActive ? "tabbar-item active" : "tabbar-item"}>👤 Profil</NavLink>
    </div>
  )
}
