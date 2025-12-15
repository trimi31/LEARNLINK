import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)

  useEffect(() => {
    // Test health endpoint
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealthStatus(data))
      .catch(err => setHealthStatus({ error: err.message }))

    // Test database ping endpoint
    fetch('/api/db-ping')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => setDbStatus({ error: err.message }))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>LearnLink</h1>
        <p>Monorepo skeleton is ready!</p>
        
        <div className="status-container">
          <div className="status-card">
            <h2>API Health</h2>
            <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
          </div>
          
          <div className="status-card">
            <h2>Database Connection</h2>
            <pre>{JSON.stringify(dbStatus, null, 2)}</pre>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App

