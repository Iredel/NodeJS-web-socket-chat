import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import axios from "axios";

const UserRooms = () => {
    const [roomList, setRoomList] = useState([])
    const [responseMessage, setResponseMessage] = useState('');
    const userId = useParams().id;

    useEffect(()=>{
        getUserRooms().then(r => null)
    }, [])

    const getUserRooms = async () =>{
        await axios.post('http://localhost:5001/api/rooms/get_user_rooms', {
            userId: userId
        })
            .then(response => {
                if (response.data.length === 0) {
                    setResponseMessage('У вас щє немає кімнат')
                    setRoomList([])
                } else {
                    // массив содержит элементы
                    setRoomList(response.data);
                }
            })
    }
    const deleteRoom = (roomId) =>{
        axios.post('http://localhost:5001/api/rooms/deleteRoom', {roomId: roomId})
            .then(response =>{
                const index = roomList.findIndex(user => user._id === roomId);
                if (index !== -1) {
                    roomList.splice(index, 1);
                }
                setResponseMessage(response.data.message)
            })
    }
    return (
        <div className={"main"}>
            <div className={"form"}>
                <h2>Список ваших кімнат</h2>
                <h4>{responseMessage}</h4>
            {roomList.map((room)=>(
                <div className="list-group-item d-flex justify-content-between align-items-center list" key={room.roomId}>
                    <div className="ms-2 me-auto">
                        <div className="fw-bold text-light">{room.roomName}</div>
                    </div>
                    <a className={"btn text-bg-success"} href={`/room/${room.roomId}`}>Увійти</a>
                    <button className={"btn text-bg-danger m-2"}
                        onClick={()=>{
                            deleteRoom(room._id)
                        }}
                    >Видалити</button>
                </div>
            ))}
            </div>
            <a className="btn bg-primary text-light m-4" href="/create_room">Назад</a>
        </div>
    )
}


export default UserRooms;