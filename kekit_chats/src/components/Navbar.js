import React, {useContext, useState} from 'react';
import {Navbar, Nav, Container, Button, Dropdown, NavDropdown} from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

const NavBarComponent = ({username, avatar}) => {
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const auth = useContext(AuthContext)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);

        const file = e.target.files[0];
        setFileName(file.name)
    }
    const sendPhotoToServer = async () =>{
        console.log(file)
        const formData = new FormData();
        formData.append('avatar', file);
        console.log(formData)
        await axios.post('http://localhost:5001/api/photos/uploadAvatar', formData);
    }

    const changeAvatar = async () =>{
        await axios.post("http://localhost:5001/api/rooms/change_avatar", {
            userId: auth.userId,
            fileName: fileName
        })
            .then(response =>{
                console.log(response.data.avatarLink)
                localStorage.setItem('userData', JSON.stringify({
                    userId: auth.userId,
                    token: auth.token,
                    username: auth.username,
                    avatar: response.data.avatarLink
                }))
            })
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Kekit Chats</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        <Nav.Item>
                            <NavDropdown title="Профіль" id="parent-dropdown">
                                <NavDropdown.Item href="#">
                                    <img
                                    src={avatar}
                                    className="rounded-circle"
                                    height="40"
                                    alt="Avatar"
                                    style={{marginRight: 15}}
                                    />{username}</NavDropdown.Item>
                                <NavDropdown.Item> </NavDropdown.Item>
                                <input className="btn" id="file-input" type="file"  onChange={handleFileChange} />
                                <button className="btn bg-primary m-2 text-light" onClick={()=>{
                                    sendPhotoToServer().then(r => null )
                                    changeAvatar().then(r => null )
                                }}>Змінити аватар</button>
                                <NavDropdown.Item href={`/userRooms/${auth.userId}`} >Ваші кімнати</NavDropdown.Item>
                                <NavDropdown.Item href="#"><Dropdown.Item ><Button onClick={auth.logout}>Logout</Button></Dropdown.Item></NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBarComponent;