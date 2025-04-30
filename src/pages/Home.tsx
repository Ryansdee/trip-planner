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
            ...(doc.data() as { title: string; description: string; address: string; date: { seconds: number } })
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

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Liste des événements</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : events.length > 0 ? (
        <div className="row">
          {events.map(event => {
            const isDone = doneEvents.has(event.id);
            return (
              <div key={event.id} className="col-md-6 col-lg-4 mb-4">
                <div className={`card h-100 ${isDone ? 'bg-light' : ''}`}>
                  <div className="card-body">
                    <h5 className={`card-title ${isDone ? 'text-decoration-line-through text-muted' : ''}`}>
                      {event.title}
                    </h5>
                    <p className={`card-text ${isDone ? 'text-muted text-decoration-line-through' : ''}`}>
                      {event.description}
                    </p>
                    <p className={`card-text ${isDone ? 'text-muted text-decoration-line-through' : ''}`}>
                      <strong>Adresse :</strong> {event.address}
                    </p>
                    <p className={`card-text ${isDone ? 'text-muted text-decoration-line-through' : ''}`}>
                      <strong>Date :</strong> {new Date(event.date.seconds * 1000).toLocaleString()}
                    </p>
                    {!isDone && (
                      <button
                        className="btn btn-outline-success btn-sm mt-2"
                        onClick={() => handleMarkAsDone(event.id)}
                      >
                        ✅ Fait
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center">Aucun événement trouvé.</p>
      )}

      <TabBar />
    </div>
  );
};

export default Home;
