import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [doneEvents, setDoneEvents] = useState<Set<string>>(new Set());

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

  const groupedEvents = events.reduce((acc: Record<string, any[]>, event) => {
    const date = new Date(event.date.seconds * 1000);
    const dateKey = date.toISOString().split('T')[0];
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push({ ...event, dateObj: date });
    return acc;
  }, {});

  return (
    <div className="container my-4" style={{ height: 'auto', paddingBottom: '30px' }}>
      <h1 className="text-center mb-4 titrehaut">Événements par jour</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : Object.keys(groupedEvents).length > 0 ? (
        Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className="mb-4">
            <h5 className="mb-3">{new Date(date).toLocaleDateString()}</h5>
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
                    {!isDone && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleMarkAsDone(event.id)}
                      >
                        ✅
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-center">Aucun événement trouvé.</p>
      )}

      <TabBar />
    </div>
  );
};

export default Home;
