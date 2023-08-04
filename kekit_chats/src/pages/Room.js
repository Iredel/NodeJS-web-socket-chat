import React, {useContext, useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import {Button, Container} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css'
import axios from "axios";
import '../styles/RoomStyle.css'
import EmojiPicker from "emoji-picker-react";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import {Item, Menu, useContextMenu} from "react-contexify";
import 'react-contexify/ReactContexify.css';
const Room = () => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [roomObjectID, setRoomObjectID] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [isPickerVisible, setIsPickerVisible] = useState(false)
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const auth = useContext(AuthContext);
    const linkId = useParams().id;
    const socketRef = useRef();
    const fileInputRef = useRef(null);

    useEffect(() => {
            // Подключаемся к серверу
            socketRef.current = io("http://localhost:3001");
            socketRef.current.emit('join_room', linkId);

            socketRef.current.on('receive_message', (data) => {
                setMessageList((list) => [...list, data]);
            });
            getMessage(linkId)
            return () => {
                // Отключаемся от сервера при размонтировании компонента
                socketRef.current.disconnect();
            };
        },
        []);

    const getMessage = (id)=>{
        axios.post('http://localhost:5001/api/rooms/get_messages', {roomId:id})
            .then(response => {
                setMessageList(response.data.messages)
                setRoomObjectID(response.data._id)
                console.log('Успешный ответ от сервера:', response.data);
            })
            .catch(error => {
                // Обработка ошибки
                console.error('Ошибка при выполнении POST-запроса:', error);
            });
    }
    const sendMessage = async () => {
            const messageData = {
                room: linkId,
                username: auth.username,
                avatar: auth.avatar,
                message: currentMessage,
                image: (fileName ? `http://localhost:5001/api/photos/photo/${fileName}` : ''),
                dispatchTime: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            sendPhotoToServer().then(r => null)

            axios.post('http://localhost:5001/api/rooms/add_message', messageData)


            await socketRef.current.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');

            fileInputRef.current.value = "";
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);

        const file = e.target.files[0];
        setFileName(file.name)
    }
    const sendPhotoToServer = async () =>{
        console.log(file)
        const formData = new FormData();
        formData.append('photo', file);
        console.log(formData)
         await axios.post('http://localhost:5001/api/photos/upload', formData);
    }

    const ROOT_CSS = css({
        height: '70vh',
        width: 'auto',
        background: '#313338',
        border: "1px solid black"
    });
    const deleteMessage = (messageId, roomId) =>{
        axios.post('http://localhost:5001/api/rooms/deleteMessage', {roomId: roomId, messageId: messageId})
            .then(() =>{
                const index = messageList.findIndex(message => message._id === messageId);
                if (index !== -1) {
                    const newMessageList = [...messageList];
                    newMessageList.splice(index, 1);
                    setMessageList(newMessageList)
                }
            })
    }
    const handleChange = (event) => {
        const { value } = event.target;
        setCurrentMessage(value);
    };

    const message_context_menu = 'message_context_menu'

    const { show } = useContextMenu({
        id: message_context_menu,
    });

    function handleContextMenu(event, message){
        show({
            event,
            props: {
                key: 'value',
                message: message
            }
        })
    }

    const handleItemClick = ({ id, event, props }) => {
        switch (id) {
            case "delete":
                deleteMessage(props.message,  roomObjectID)
                break;
        }
    }


    return (
        <div className="text-light">
            <h1>Кімната: {linkId} <a className="btn bg-primary text-light" href="/create_room">Назад</a></h1>
            <div className="row ">
                <div className="col-9">
                    <div className="chat-window">
                <div className="chat-header">
                    <p>Чат</p>
                </div>
                <ScrollToBottom className={ROOT_CSS}>
                    <Container>
                        <div className="chat-body text-light ">
                            {messageList.map((messageContent) => {
                                return (
                                    <div key={messageContent._id}>
                                        <div className="d-flex my-2 message-box" onContextMenu={(event) => handleContextMenu(event, messageContent._id)}>
                                            <div>
                                                <img
                                                    src={messageContent.avatar}
                                                    className="rounded-circle"
                                                    height="43"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="mx-2">
                                                <p className=" small text-light " >{messageContent.username} {messageContent.dispatchTime}
                                                    <div className=" text-light mb-2">
                                                    <div className="row-1">
                                                        <div className="col">{messageContent.message}</div>
                                                        <div className="col">
                                                            {messageContent.image ? <img style={{height: "40%", width:"40%", borderRadius: '8px'}} src={messageContent.image}/> : null}
                                                        </div>
                                                    </div>
                                                </div></p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Container>
                </ScrollToBottom>
                <div className="input-group mb-3 ">
                    <input
                        className="form-control"
                        type="text"
                        name="currentMessage"
                        value={currentMessage}
                        onChange={handleChange}
                        required
                        onKeyPress={(event) => {
                            if (event.key === 'Enter' && currentMessage !== '') {
                                sendMessage().then(r => null)
                            }
                            else if(event.key === 'Enter' && currentMessage === '' && file != null ){
                                sendMessage().then(r => null)
                            }
                        }}

                        placeholder="Введите сообщение..."
                    />

                    <input className="btn" id="file-input" type="file" ref={fileInputRef} onChange={handleFileChange} />
                    <Button onClick={()=>{
                        if(currentMessage !== '' ){
                            sendMessage().then(r => null)
                        }
                        else if(currentMessage === '' && file != null ){
                            sendMessage().then(r => null)
                        }
                    }
                    }>&#9992;</Button>
                    <DropdownButton drop="up" title="&#128578;" variant="secondary" onClick={()=>{
                        setIsPickerVisible(!isPickerVisible)
                    }}>
                        <Dropdown.Item >
                            {isPickerVisible ? <EmojiPicker onEmojiClick={(emoji) => {setCurrentMessage(emoji.emoji) }} ></EmojiPicker> : null}
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <Menu id={message_context_menu}>
                    <Item id="delete" message={"ban"} onClick={handleItemClick}>Видалити</Item>
                </Menu>
            </div>
                </div>
            </div>
        </div>
    );
};

export default  React.memo(Room);

