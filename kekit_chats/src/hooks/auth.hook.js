import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [avatar, setAvatar] = useState(null)

  const login = useCallback((jwtToken, id, userName, Avatar) => {
    setToken(jwtToken)
    setUserId(id)
    setUsername(userName)
    setAvatar(Avatar)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id,
      token: jwtToken,
      username: userName,
      avatar: Avatar
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId, data.username, data.avatar)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, ready, avatar, username }
}
