import { useState } from 'react'
import { Button } from './ui/button'
import { EventModal } from './EventModal'

interface AddEventProps {
  fetchEvents: () => void
}

export const AddEvent = ({fetchEvents}: AddEventProps) => {

  const [modalOpen, setModalOpen] = useState(false);
  return (
    // 1 button that would open a modal with  fields for adding an event
    // user i
    <div>
      <Button onClick={() => { setModalOpen(true) }}>Add Event</Button>
      {modalOpen && (<EventModal setModalOpen={setModalOpen} fetchEvents={fetchEvents}></EventModal>)}
    </div>
  )
}