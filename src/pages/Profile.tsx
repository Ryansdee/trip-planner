import { useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import TabBar from '../components/TabBar';
import { FaUserCircle, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';

export default function Profile() {
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

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!userInfo) return null;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', width: '100vw', padding: '1rem', backgroundColor: '#f8f9fa' }}
    >
      <div
        className="profile-card shadow p-4 rounded-4 text-center"
        style={{ maxWidth: 400, width: '100%', backgroundColor: '#fff' }}
      >
        <FaUserCircle size={80} className="mb-3 text-primary" />
        <h2 className="mb-3">{userInfo.name}</h2>
        <p className="mb-4 text-muted">
          <FaEnvelope className="me-2" />
          {userInfo.email}
        </p>
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Se déconnecter
        </button>
      </div>

      <div className="w-100 mt-5">
        <TabBar />
      </div>
    </div>
  );
}
