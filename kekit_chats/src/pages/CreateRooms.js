import React, {useContext,  useState} from 'react';
import '../styles/CreateRoomsStyle.css'
import {Modal, Button, Form} from 'react-bootstrap';
import {AuthContext} from "../context/AuthContext";
import NavBarComponent from "../components/Navbar";
import axios from "axios";

const CreateRooms = () => {
    const auth = useContext(AuthContext)
    const [shows, setShows] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [roomId2, setRoomId2] = useState('');
    const [responseMessage, setResponseMessage] = useState('');


    const handleClose = () => setShows(false);
    const handleShow = () => setShows(true);

    const handleSubmit = () => {
        handleClose();
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setRoomName(prevState => ({
            ...prevState,
            [name]: value
        }));
        setRoomId(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    const createRoom = (data)=>{
        axios.post('http://localhost:5001/api/rooms/create_room', {
            roomName: data.roomName,
            userId: auth.userId
        })
            .then(response => {
                // Обработка успешного ответа от сервера
                setRoomId2(response.data)
                console.log('Успешный ответ от сервера:', response.data);
            })
            .catch(error => {
                // Обработка ошибки
                console.error('Ошибка при выполнении POST-запроса:', error);
            });
    }
    const getRooms = (data) =>{
        axios.post('http://localhost:5001/api/rooms/get_room', data)
            .then(response => {
                if ([response.data][0] === '') {
                    setResponseMessage('Такої кімнати не існує')
                    setRooms([])
                } else {
                    // массив содержит элементы
                    setRooms([response.data])
                }
            })
            .catch(error => {
                console.error('Ошибка при выполнении POST-запроса:', error);
            });
    }

  return (
      <>
          <NavBarComponent username={auth.username} avatar={auth.avatar}></NavBarComponent>
      <div className={"main"}>
        <h1>Kekit Chats</h1>
          <div className={"form"}>
              <div className="input-group mb-3 ">
                  <input type="text" className="form-control" name="roomId" onChange={handleChange} placeholder="Введіть id кімнати..."/>
                  <Button onClick={()=>{
                          if(roomId !== '') {
                          getRooms(roomId)
                              setResponseMessage('')
                      }
                  }}>Знайти</Button>
                  <button className={"btn text-bg-warning"} onClick={handleShow}>
                      Create Room +
                  </button>
                  <Modal show={shows} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title>Створити кімнату</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <Form>
                                  <Form.Label>Ім'я кімнати</Form.Label>
                                  <Form.Control
                                      type="text"
                                      placeholder="Введіть ім'я кімнати"
                                      name="roomName"
                                      onChange={handleChange}
                                      required
                                  />
                          </Form>
                          {roomId2 ? <div>Id вашої кімнати: <g className="bg-dark text-light">{roomId2}</g>, відправти його друзям для під'єдняння до кімнати</div> : null}
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={()=>{
                              handleClose()
                              setRoomId2('')
                          }}

                          >
                              Закрити
                          </Button>
                          <Button variant="primary" onClick={()=>{
                              createRoom(roomName)
                              setRoomId2('')
                          }}>
                              Створити
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
          </div>
          <h3>Знайдені кімнати:</h3>
          <h4>{responseMessage}</h4>
          <div className={"room-list"}>
              <ol className="list-group list-group ">
                  {rooms.map((room)=>(
                          <div className="list-group-item d-flex justify-content-between align-items-center list" key={room.roomId}>
                              <div className="ms-2 me-auto">
                                  <div className="fw-bold text-light">{room.roomName}</div>
                              </div>
                              <a className={"btn text-bg-success"} href={`/room/${room.roomId}`}>Увійти</a>
                          </div>
                  ))}
                  <br />
              </ol>
          </div>
      </div>
      </>
  );
};
export default CreateRooms;
