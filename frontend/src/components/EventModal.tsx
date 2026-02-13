import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Input } from '../utils/Input';
import { CREATE_EVENIMENT_MUTATION } from '../graphql/queries';

interface EventModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchEvents: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ setModalOpen, fetchEvents }) => {
  const [eventInfo, setEventInfo] = useState({
    id: 0,
    nume: "Default Value",
    data: "2026-01-30",
    locatie: "Default Location",
  });

  // GraphQL mutation hook
  const [createEvenimentGraphQL, { loading: gqlLoading }] = useMutation(CREATE_EVENIMENT_MUTATION, {
    onCompleted: () => {
      console.log('Event added via GraphQL');
      setModalOpen(false);
      fetchEvents();
    },
    onError: (err) => {
      console.error('GraphQL error:', err);
    },
  });

  const submitEvent = async () => {
    console.log('Submitting event with info:', eventInfo);
    try {
      await createEvenimentGraphQL({
        variables: {
          input: {
            nume: eventInfo.nume,
            data: eventInfo.data,
            locatie: eventInfo.locatie,
          },
        },
      });
    } catch (err) {
      console.error('Error creating event:', err);
    }
  }

  const handleOnChangeEventName = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, nume: e.target.value }))
  const handleOnChangeEventDate = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, data: e.target.value }))
  const handleOnChangeEventLocation = (e: React.ChangeEvent<HTMLInputElement>) => setEventInfo((prev) => ({ ...prev, locatie: e.target.value }))

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', backgroundColor: 'gray' }}>

      <Input type="text" placeholder="Event Name" value={eventInfo.nume} onChange={handleOnChangeEventName} />
      <Input type="date" placeholder="Event Date" value={eventInfo.data} onChange={handleOnChangeEventDate} />
      <Input type="text" placeholder="Event Location" value={eventInfo.locatie} onChange={handleOnChangeEventLocation} />
      <button onClick={submitEvent} disabled={gqlLoading}>Add Event</button>
      <button onClick={() => { setModalOpen(false) }}>Close</button>
    </div>
  )
}
