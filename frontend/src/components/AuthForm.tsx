import React from 'react'
import { Button } from './ui/button'

type AuthMode = 'login' | 'register'

interface AuthFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface AuthFormProps {
  mode: AuthMode
  values: AuthFormValues
  error: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onModeChange: (mode: AuthMode) => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  values,
  error,
  onChange,
  onSubmit,
  onModeChange
}) => {
  return (
    <div className="auth-card">
      <div className="auth-toggle">
        <Button
          variant={mode === 'login' ? 'default' : 'outline'}
          onClick={() => onModeChange('login')}
        >
          Login
        </Button>
        <Button
          variant={mode === 'register' ? 'default' : 'outline'}
          onClick={() => onModeChange('register')}
        >
          Register
        </Button>
      </div>

      <h1>{mode === 'login' ? 'Autentificare' : 'Înregistrare'}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <>
            <div className="form-group">
              <label>Prenume</label>
              <input
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nume</label>
              <input
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={onChange}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Parolă</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-actions">
          <Button type="submit" className="w-full">
            {mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  )
}

