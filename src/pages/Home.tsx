import { useEffect, useState } from 'react';
import { db } from '../firebase-config'; // Importer la configuration Firestore
import { collection, getDocs } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './Home.css'; // Assurez-vous que ce fichier contient les styles correspondants

const Home = () => {
  // Déclare un état pour les événements
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Pour savoir si les données sont en cours de chargement

  // Utilisation de useEffect pour récupérer les données au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la collection "events"
        const querySnapshot = await getDocs(collection(db, 'events'));
        
        // Map les documents Firestore dans un tableau d'objets
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Mettre à jour l'état des événements avec les données récupérées
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Appeler la fonction de récupération
  }, []); // Le tableau vide [] assure que la récupération ne se fait qu'une seule fois au montage du composant

  return (
    <div className="home-container">
      <h1 className="page-title">Liste des événements</h1>

      {/* Affichage des événements */}
      <div className="events-container">
        {loading ? (
          <p>Chargement...</p>
        ) : events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>
              <p className="event-address">{event.address}</p>
              <p className="event-time">
                {new Date(event.date.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>Aucun événement trouvé.</p>
        )}
      </div>

      {/* TabBar en bas */}
      <TabBar />
    </div>
  );
};

export default Home;
