import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { AddEvent } from './AddEvent'
import { GET_EVENIMENTE_QUERY, UPDATE_EVENIMENT_MUTATION, DELETE_EVENIMENT_MUTATION } from '../graphql/queries'

interface EventItem {
  id: number
  nume: string
  data: string
  locatie: string
}

interface EventsTableProps {
  onLogout: () => void
}

export const EventsTable: React.FC<EventsTableProps> = ({ onLogout }) => {
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editFormData, setEditFormData] = React.useState<Partial<EventItem>>({})

  // GraphQL hooks
  const { data, loading, refetch } = useQuery(GET_EVENIMENTE_QUERY)

  const [updateEvenimentGraphQL] = useMutation(UPDATE_EVENIMENT_MUTATION, {
    onCompleted: () => {
      console.log('Event updated via GraphQL')
      setEditingId(null)
      setEditFormData({})
      refetch()
    },
    onError: (err) => {
      console.error('GraphQL update error:', err)
    },
  })

  const [deleteEvenimentGraphQL] = useMutation(DELETE_EVENIMENT_MUTATION, {
    onCompleted: () => {
      console.log('Event deleted via GraphQL')
      refetch()
    },
    onError: (err) => {
      console.error('GraphQL delete error:', err)
    },
  })

  // Delete event
  const handleDelete = async (id: number) => {
    await deleteEvenimentGraphQL({
      variables: { id },
    })
  }

  // Start editing
  const handleStartEdit = (event: EventItem) => {
    setEditingId(event.id)
    setEditFormData({ ...event })
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({})
  }

  // Save edited row
  const handleSaveEdit = async (id: number) => {
    await updateEvenimentGraphQL({
      variables: {
        id,
        input: {
          nume: editFormData.nume || '',
          data: editFormData.data || '',
          locatie: editFormData.locatie || '',
        },
      },
    })
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  console.log('Fetched events@@@@:', data)
  const events: EventItem[] = data?.events || []

  return (
    <>
      <AddEvent fetchEvents={refetch} />

      <div className="header">
        <h1>📅 Evenimentele mele</h1>
        <button className="btn-primary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {loading && <p className="loading">Se încarcă...</p>}

      {!loading && events.length === 0 ? (
        <div className="empty-state">
          <p>Nu sunt evenimente de afișat.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Data</th>
                <th>Locație</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>

                  <td>
                    {editingId === event.id ? (
                      <input
                        name="nume"
                        value={editFormData.nume || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      event.nume
                    )}
                  </td>

                  <td>
                    {editingId === event.id ? (
                      <input
                        type="date"
                        name="data"
                        value={editFormData.data?.slice(0, 10) || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      new Date(event.data).toLocaleDateString()
                    )}
                  </td>

                  <td>
                    {editingId === event.id ? (
                      <input
                        name="locatie"
                        value={editFormData.locatie || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      event.locatie
                    )}
                  </td>

                  <td>
                    {editingId === event.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(event.id)}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(event)}>Edit</button>
                        <button onClick={() => handleDelete(event.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}