import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import eventsData from '../events.json';
import { db, collection, addDoc } from '../firebase-config';
import { Timestamp } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './AddEvent.css'

export default function AddEvent() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [eventTime, setEventTime] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleAddEvent = async () => {
    if (selectedEvent && eventTime) {
      const eventDate = new Date(date);
      const [h, m] = eventTime.split(':').map(Number);
      eventDate.setHours(h);
      eventDate.setMinutes(m);

      try {
        await addDoc(collection(db, 'events'), {
          ...selectedEvent,
          date: Timestamp.fromDate(eventDate),
        });
        setSuccessMessage("Événement ajouté !");
      } catch {
        setSuccessMessage("Erreur, réessaye.");
      }
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Ajouter un événement</h1>

      <div className="mb-4 d-flex justify-content-center text-dark">
        <Calendar value={date} onChange={(d) => d instanceof Date && setDate(d) } className="text-dark" />
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          onChange={(e) =>
            setSelectedEvent(eventsData.find(ev => ev.id === e.target.value) || null)
          }
        >
          <option value="">Choisir un événement</option>
          {eventsData.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <input
          type="time"
          className="form-control"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>

      <button className="btn btn-secondary w-100 mb-3" onClick={handleAddEvent}>Ajouter</button>

      {successMessage && <div className="alert alert-info">{successMessage}</div>}

      <TabBar />
    </div>
  );
}
