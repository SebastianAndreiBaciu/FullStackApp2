import { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import './App.css'
import { AUTH_URL } from "./utils/constants";
import { apolloClient } from './graphql/client'
import { AuthForm } from './components/AuthForm'
import { EventsTable } from './components/EventsTable'

interface AuthResponse {
  token: string
  userId: number
  email: string
  firstName: string
  lastName: string
}

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!token

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const endpoint = authMode === 'login' ? `${AUTH_URL}/login` : `${AUTH_URL}/register`

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          email: authForm.email,
          password: authForm.password
        })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Eroare la autentificare')
      }

      const data: AuthResponse = await res.json()
      setToken(data.token)
      localStorage.setItem('token', data.token)
      setAuthForm({ firstName: '', lastName: '', email: '', password: '' })
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Eroare la autentificare')
    }
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <ApolloProvider client={apolloClient}>
      <div className="container">
        {!isAuthenticated ? (
          <AuthForm
            mode={authMode}
            values={authForm}
            error={error}
            onChange={handleAuthChange}
            onSubmit={handleAuthSubmit}
            onModeChange={setAuthMode}
          />
        ) : (
          <EventsTable onLogout={handleLogout} />
        )}
      </div>
    </ApolloProvider>
  )
}

export default App
