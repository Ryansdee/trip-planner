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
        setSuccessMessage("✅ Événement ajouté !");
        setSelectedEvent(null);
        setEventTime('');
      } catch {
        setSuccessMessage("❌ Erreur lors de l'ajout.");
      }
    }
  };

  return (
    <div className="add-event-container container">
      <h2 className="text-center mb-4">📌 Ajouter un événement</h2>

      <div className="calendar-wrapper mb-4 d-flex justify-content-center">
        <Calendar
          value={date}
          onChange={(d) => d instanceof Date && setDate(d)}
          className="styled-calendar"
        />
      </div>

      <div className="form-wrapper mb-3">
        <label className="form-label">Sélectionnez un événement</label>
        <select
          className="form-select"
          value={selectedEvent?.id || ''}
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

      <div className="form-wrapper mb-3">
        <label className="form-label">Heure de l'événement</label>
        <input
          type="time"
          className="form-control"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-100 mb-3" onClick={handleAddEvent}>
        ➕ Ajouter l'événement
      </button>

      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}

      <TabBar />
    </div>
  );
}
