import { useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import TabBar from '../components/TabBar';

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
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 me-auto" style={{ width: '100dvw' }}>
      <div className="card p-4 shadow-sm w-100 text-left" style={{ maxWidth: '500px' }}>
        <h1 className="mb-4 text-center">Mon Profil</h1>
        <div className="mb-3">
          <strong>Nom :</strong> <span>{userInfo.name}</span>
        </div>
        <div className="mb-3">
          <strong>Email :</strong> <span>{userInfo.email}</span>
        </div>
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>

      <div className="w-100 mt-5">
        <TabBar />
      </div>
    </div>
  );
}
