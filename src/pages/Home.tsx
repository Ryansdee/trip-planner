import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './Home.css'; // CSS modifié à la fin

const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [doneEvents, setDoneEvents] = useState<Set<string>>(new Set());

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
        console.error("Erreur de chargement :", error);
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
      const q = query(collection(db, 'events'), where('id', '==', customId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Événement introuvable.");
        return;
      }

      await Promise.all(querySnapshot.docs.map(docSnap =>
        deleteDoc(doc(db, 'events', docSnap.id))
      ));

      setEvents(prev => prev.filter(event => event.id !== customId));
      setDoneEvents(prev => {
        const updated = new Set(prev);
        updated.delete(customId);
        return updated;
      });
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const getDayNumber = (eventDate: Date) => {
    const diffTime = eventDate.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24)) + 1;
  };

  const groupedEvents = events.reduce((acc: Record<string, any[]>, event) => {
    const date = new Date(event.date.seconds * 1000);
    const dateKey = date.toISOString().split('T')[0];
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push({ ...event, dateObj: date });
    return acc;
  }, {});

  return (
    <div className="container home-container">
      <header className="home-header">
        <h2>📅 Planning des Événements</h2>
        <p className="home-subtitle">Vue quotidienne claire et organisée</p>
      </header>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : Object.keys(groupedEvents).length > 0 ? (
        Object.entries(groupedEvents).map(([date, dayEvents]) => {
          const eventDate = new Date(date);
          const dayNumber = getDayNumber(eventDate);
          return (
            <section key={date} className="day-section">
              <div className="day-header">
                <h5>{eventDate.toLocaleDateString()}</h5>
                <span className="day-badge">Jour {dayNumber}</span>
              </div>
              <div className="event-list">
                {dayEvents.map(event => {
                  const isDone = doneEvents.has(event.id);
                  return (
                    <div
                      key={event.id}
                      className={`event-card ${isDone ? 'event-done' : ''}`}
                    >
                      <div>
                        <strong>{event.dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> — {event.title}
                      </div>
                      <div className="btn-actions">
                        {!isDone && (
                          <button className="btn btn-check" onClick={() => handleMarkAsDone(event.id)}>✅</button>
                        )}
                        <button className="btn btn-delete" onClick={() => handleDeleteByCustomId(event.id)}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-center text-muted">Aucun événement disponible.</p>
      )}

      <TabBar />
    </div>
  );
};

export default Home;
