import React, { useState } from 'react';
import { Input } from '../utils/Input';
import { EVENTS_URL } from "../utils/constants";
interface EventModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventModal: React.FC<EventModalProps> = ({ setModalOpen }) => {
  const token = localStorage.getItem('token') || '';
  const [eventInfo, setEventInfo] = useState({
    name: '',
    date: '',
    location: '',

  });

  const submitEvent = () => {
    // send eventInfo to backend
    // post call to be
    // body = eventIfo
    fetch(EVENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventInfo)
    }).then(res => {
      if (res.ok) {
        console.log('Event added successfully');
        setModalOpen(false);
      } else {
        console.log('Failed to add event');
      }
    }).catch(err => {
      console.error('Error adding event:', err);
      console.log('Error adding event');
    });
  }

  const handleOnChangeEventName = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, name: e.target.value }))
  const handleOnChangeEventDate = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, date: e.target.value }))
  const handleOnChangeEventLocation = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, location: e.target.value }))

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', backgroundColor: 'gray' }}>

      <Input type="text" placeholder="Event Name" value={eventInfo.name} onChange={handleOnChangeEventName} />
      <Input type="date" placeholder="Event Date" value={eventInfo.date} onChange={handleOnChangeEventDate} />
      <Input type="text" placeholder="Event Location" value={eventInfo.location} onChange={handleOnChangeEventLocation} />
      <button onClick={submitEvent}>Add Event</button>
      <button onClick={() => { setModalOpen(false) }}>Close</button>
    </div>
  )
}


// public int Id { get; set; }
// public string Nume { get; set; }
// public DateTime Data { get; set; }
// public string Locatie { get; set; }

// // Legătură cu utilizatorul care a creat evenimentul
// public int UserId { get; set; }