import { useState, useEffect } from 'react'
import { auth } from '../firebase-config'
import { signOut } from 'firebase/auth'
import './Profile.css'
import TabBar from '../components/TabBar'

export default function Profile() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setUserInfo({
        name: user.displayName || 'Utilisateur',
        email: user.email || 'Email inconnu',
      })
    }
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

  if (!userInfo) return null

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Mon Profil</h1>

        <div className="profile-info">
          <div className="profile-item">
            <strong>Nom :</strong> {userInfo.name}
          </div>
          <div className="profile-item">
            <strong>Email :</strong> {userInfo.email}
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
            <TabBar />
    </div>
  )
}
