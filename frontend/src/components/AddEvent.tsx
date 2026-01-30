import React, { useState } from 'react'
import { EventModal } from './EventModal'

export const AddEvent = () => {

  const [modalOpen, setModalOpen] = useState(false);
  return (
    // 1 button that would open a modal with  fields for adding an event
    // user i
    <div>
      <button onClick={() => { setModalOpen(true) }}>Add Event</button>
      {modalOpen && (<EventModal setModalOpen={setModalOpen}></EventModal>)}
    </div>
  )
}