import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  username: null,
  avatar: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
})
