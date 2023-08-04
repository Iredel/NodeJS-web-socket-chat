import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {Register} from "./pages/RegisterPage";
import CreateRooms from "./pages/CreateRooms";
import Room from "./pages/Room";
import UserRooms from "./pages/UserRooms";


export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/create_room" exact>
          <CreateRooms ></CreateRooms>
        </Route>
          <Route path="/room/:id" exact>
              <Room></Room>
          </Route>
          <Route path="/userRooms/:id" exact>
            <UserRooms></UserRooms>
          </Route>
        <Redirect to="/create_room" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
        <Route path="/register">
            <Register />
        </Route>
      <Redirect to="/" />
    </Switch>
  )
}
