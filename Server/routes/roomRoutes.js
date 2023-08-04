const {Router} = require('express')
const Room = require('../models/Room')
const User = require('../models/User')
const router = Router()

function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomString += chars[randomIndex];
    }
    return randomString;
}

router.post(
    '/create_room',
    async (req, res) => {
        try {
            //console.log(req.body)
            const {roomName} = req.body
            let generetedId = generateRandomString();
            const room = new Room({ roomId: generetedId, roomName})
            await room.save()
            res.send(generetedId)

            Room.findOne({roomId: generetedId}).exec()
                .then(room => {
                    User.findById(req.body.userId).exec()
                        .then(async user => {
                            user.rooms.push({room: room._id});
                            await user.save();
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло  не так, попробуйте снова' })
        }
    })

router.post(
    '/get_room',
    async (req, res) => {
        try {
            Room.findOne({roomId: req.body.roomId}).exec()
                .then(rooms => {
                    res.send(rooms)
                })
                .catch(err => console.error(err));
        } catch (e) {
            res.status(500).json({ message: 'Что -то пошло  не так, попробуйте снова' })
        }
    })

router.post(
    '/get_user_rooms',
    async (req, res) => {
        try {
            User.findById(req.body.userId).exec()
                .then(user => {
                    const roomIds = user.rooms.map(roomData => roomData.room);
                    Room.find({ _id: { $in: roomIds } })
                        .then((rooms) => {
                           res.send(rooms)
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch(err => console.error(err));
        } catch (e) {

            res.status(500).json({ message: 'Что-то пошло  не так, попробуйте снова' })
        }
    })

router.post(
    '/deleteRoom',
    async (req, res)=>{
        try{
            Room.findByIdAndDelete(req.body.roomId).exec()
                .then(doc =>{
                    res.send({message: "Кімната видалина"})
                })
        } catch (e) {

        }
    }
)

router.post(
    '/get_messages',
    async (req, res) => {
        try {
            Room.findOne({roomId: req.body.roomId}).exec()
                .then(rooms => {
                    res.send(rooms)
                })
                .catch(err => console.error(err));
        } catch (e) {
            res.status(500).json({ message: 'Что -то пошло не так, попробуйте снова ' })
        }
    })

router.post(
    '/add_message',
    async (req, res) => {
        try {
            Room.findOne({roomId: req.body.room}).exec()
                .then(room => {
                    let imageLink = (req.body.image ? req.body.image : '')
                    room.messages.push({avatar: req.body.avatar ,username: req.body.username, message: req.body.message, image: imageLink, dispatchTime:req.body.dispatchTime})
                    room.save()
                    console.log("Сообщение сохранено!!")
                })
                .catch(err => console.error(err));
        } catch (e) {
            res.status(500).json({ message: 'Что -то пошло не так, попробуйте снова' })
        }
    })

router.post(
    '/deleteMessage',
    async (req, res)=>{
        try{
            Room.findByIdAndUpdate(req.body.roomId, { $pull: { messages: { _id: req.body.messageId } } }).exec()
                .then(response =>{
                    console.log("deleted")
                    res.send({message: "видалина"})
                })
        } catch (e) {

        }
    }
)

router.post(
    '/change_avatar',
    async (req, res) => {
        try {
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { avatar: `http://localhost:5001/api/photos/avatar/${req.body.fileName}` },
                { new: true}
            ).exec()
                .then(user => {
                    res.send({avatarLink: `http://localhost:5001/api/photos/avatar/${req.body.fileName}`})
                })
                .catch(err => console.error(err));
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло  не так, попробуйте снова' })
        }
    })







module.exports = router