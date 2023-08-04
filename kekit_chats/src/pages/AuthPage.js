import React, {useContext, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Alert, Button} from 'react-bootstrap';
import axios from "axios";

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const {loading, request} = useHttp()
    const [showError, setShowError] = useState(false);
  const [form, setForm] = useState({
    email: '', password: ''
  })



  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const loginHandler = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/login',{...form})
          .then(response =>{
              if(response.status === 200){
                  auth.login(response.data.token, response.data.userId, response.data.username, response.data.avatarImg)
              }
          })
    } catch (e) {
        setShowError(true);
    }
  }



  return (
      <div>
      <div className="container-md mt-5 bg-light w-50 h-50% rounded">
        <h1>Авторизація</h1>
        <div className="form-floating mb-3">
          <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Введите email"
              name='email'
              value={form.email}
              onChange={changeHandler}
          />
          <label htmlFor="email">Пошта</label>
        </div>

        <div className="form-floating">
          <input
              type="password"
              className="form-control"
              id="password"
              name='password'
              placeholder="Password"
              value={form.password}
              onChange={changeHandler}
          />
          <label htmlFor="password">Пароль</label>
        </div>

        <button
            className="btn btn-primary mt-3 mb-3"
            style={{marginRight: 10}}
            disabled={loading}
            onClick={()=>{
              loginHandler()
            }}
        >Увiйти
        </button>
        <a href='/register'>Зареєструватися</a>
          {showError && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  Помилка!
              </Alert>
          )}
      </div>
      </div>
  )
}

