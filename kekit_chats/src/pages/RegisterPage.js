import React, {useState} from 'react'
import {useHttp} from '../hooks/http.hook'


import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios";
import {Alert} from "react-bootstrap";


export const Register = () =>{

  const {loading, request} = useHttp()
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '', 
    password: ''
  })

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/register',  {...form})
          .then(response =>{
            if(response.status === 201){
              setShowSuccess(true);
            }
          })
    } catch (e) {
      setShowError(true);
    }
  }


    return(
    <div className="container mt-5 bg-light w-50 h-50% rounded" >
        <h1>Реєстрація</h1>
        <form className='row g-2'>
          <div className='col-md-6'>
            <label htmlFor='username' className='form-label'>Нік</label>
            <input type="text" className="form-control" name="username" value={form.username} onChange={changeHandler} required></input>
          </div>
          <div className='col-md-6'>
            <label htmlFor="email" className='form-label'>Електронна пошта</label>
            <input type="email" className='form-control' name='email' value={form.email} onChange={changeHandler}></input>
          </div>
          <div className='col-md-6'>
            <label htmlFor="password" className='form-label'>Пароль</label>
            <input type="password" className='form-control' name="password" value={form.password} onChange={changeHandler}></input>
          </div>
          <div className='col-md-10'>
            <button 
            type="submit" 
            className='btn 
            btn-primary'
            onClick={()=>{
              registerHandler()
            }}
            disabled={loading}>
                Зареєструватися 
            </button>
            <div className='col-md-10 mt-2'>
            <a href="/login">Увійти</a>
          </div>
          </div>
          {showSuccess && (
              <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                Ваша піцца була успішно замовленна, по закінченню готування вам буде надіслано повідомлення на пошту
              </Alert>
          )}
          {showError && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                Помилка!
              </Alert>
          )}
        </form> 
    </div>
    )
}