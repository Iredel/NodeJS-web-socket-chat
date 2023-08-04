const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    roomId: {type: String, required: true, unique: true},
    roomName: {type: String, required: true},
    messages: [{
        avatar:  String,
        username: String,
        message: String,
        image: String,
        dispatchTime: String
    }]
})

module.exports = model('Room', schema)