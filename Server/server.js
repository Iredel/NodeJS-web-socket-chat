const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const http = require("http");
const {Server} = require("socket.io");
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use(cors());

const port = 5001 || process.env.PORT

app.use('/api/auth', require("./routes/authRoutes"))
app.use('/api/rooms', require("./routes/roomRoutes"))
app.use('/api/photos', require("./routes/uploadedPhoto"))

function startServer(){
    try{
        mongoose.connect('mongodb+srv://Kremlejija:zMtF0EFy2jWFB4Mp@cluster0.vhjz1.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true
        })

        const server = http.createServer(app);

        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on("join_room", (data) => {
                socket.join(data);
                console.log(`User with ID: ${socket.id} joined room: ${data}`);
            });

            socket.on("send_message", (data) => {
                socket.to(data.room).emit("receive_message", data);
            });

            socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
            });
        });

        server.listen(3001, () => {
            console.log("SERVER ROOM   RUNNING");
        });

        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })

    }catch (e){
        console.log('ServerError', e.message)
        process.exit(1)
    }
}

startServer()