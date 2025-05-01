import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [doneEvents, setDoneEvents] = useState<Set<string>>(new Set());

  // Date de départ : 4 mai 2025
  const startDate = new Date('2025-05-04');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));

        const eventsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as { title: string; date: { seconds: number } })
          }))
          .sort((a, b) => a.date.seconds - b.date.seconds);

        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsDone = (id: string) => {
    setDoneEvents(prev => new Set(prev).add(id));
  };

  const handleDeleteByCustomId = async (customId: string) => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('id', '==', customId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        alert("Événement introuvable.");
        return;
      }
  
      // Suppression de tous les documents correspondants
      const deletions = querySnapshot.docs.map(docSnap =>
        deleteDoc(doc(db, 'events', docSnap.id))
      );
      await Promise.all(deletions);
  
      // Mise à jour locale
      setEvents(prev => prev.filter(event => event.id !== customId));
      setDoneEvents(prev => {
        const updated = new Set(prev);
        updated.delete(customId);
        return updated;
      });
  
      console.log("Événement supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Fonction pour calculer le jour n
  const getDayNumber = (eventDate: Date) => {
    const diffTime = eventDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    return diffDays + 1;  // Ajoute 1 pour que le 4 mai soit le Jour 1
  };

  const groupedEvents = events.reduce((acc: Record<string, any[]>, event) => {
    const date = new Date(event.date.seconds * 1000);
    const dateKey = date.toISOString().split('T')[0];
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push({ ...event, dateObj: date });
    return acc;
  }, {});

  return (
    <div className="container my-1" style={{ height: 'auto', paddingBottom: '60px', width: '100%' }}>
      <h1 className="text-center mb-4 titrehaut">Événements par jour</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : Object.keys(groupedEvents).length > 0 ? (
        Object.entries(groupedEvents).map(([date, dayEvents]) => {
          const eventDate = new Date(date);
          const dayNumber = getDayNumber(eventDate); // Calcul du "Jour n"
          return (
            <div key={date} className="mb-4">
              <h5 className="mb-3">
                {new Date(date).toLocaleDateString()} — Jour {dayNumber}
              </h5>
              <ul className="list-group">
                {dayEvents.map(event => {
                  const isDone = doneEvents.has(event.id);
                  return (
                    <li
                      key={event.id}
                      className={`list-group-item d-flex justify-content-between align-items-center ${isDone ? 'text-muted text-decoration-line-through' : ''}`}
                    >
                      <span>
                        {event.dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {event.title}
                      </span>
                      <div className="d-flex gap-2">
                        {!isDone && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleMarkAsDone(event.id)}
                          >
                            ✅
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteByCustomId(event.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      ) : (
        <p className="text-center">Aucun événement trouvé.</p>
      )}

      <TabBar />
    </div>
  );
};

export default Home;
