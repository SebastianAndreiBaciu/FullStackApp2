import React from 'react'
import { AddEvent } from './AddEvent'

interface EventItem {
  id: number
  nume: string
  data: string
  locatie: string
}

interface UsersTableProps {
  users: EventItem[]
  loading: boolean
  onLogout: () => void
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onLogout }) => {
  return (
    <>
    <AddEvent />
      <div className="header">
        <h1>📅 Evenimentele mele</h1>
        <button className="btn-primary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {loading && <p className="loading">Se încarcă...</p>}

      {!loading && users.length === 0 ? (
        <div className="empty-state">
          <p>Nu sunt evenimente de afișat.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nume</th>
                <th>Data</th>
                <th>Locație</th>
              </tr>
            </thead>
            <tbody>
              {users.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.nume}</td>
                  <td>{new Date(event.data).toLocaleString()}</td>
                  <td>{event.locatie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

