import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {Loader} from './components/Loader'



function App() {
  const {token, login, logout, userId, ready, username, avatar} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }


    return (
      <AuthContext.Provider value={{
        token, login, logout, username, avatar,  userId, isAuthenticated
      }}>
        <Router>
          <div>
            {routes}
          </div>
        </Router>
      </AuthContext.Provider>
  )
}

export default App