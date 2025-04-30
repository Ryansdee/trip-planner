import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import eventsData from '../events.json';
import { db, collection, addDoc } from '../firebase-config';
import { Timestamp } from 'firebase/firestore';
import TabBar from '../components/TabBar';
import './AddEvent.css';

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
    <div className="add-event-container">
      <h1 className="page-title">Ajouter un événement</h1>

      <Calendar value={date} onChange={(d) => d instanceof Date && setDate(d)} />

      <select
        className="event-select"
        onChange={(e) =>
          setSelectedEvent(eventsData.find(ev => ev.id === e.target.value) || null)
        }
      >
        <option value="">Choisir un événement</option>
        {eventsData.map(ev => (
          <option key={ev.id} value={ev.id}>{ev.title}</option>
        ))}
      </select>

      <input
        type="time"
        className="event-time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      <button className="submit-btn" onClick={handleAddEvent}>Ajouter</button>

      {successMessage && <p className="message">{successMessage}</p>}

      <TabBar />
    </div>
  );
}
