const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    chats: [{ type: Types.ObjectId, ref: 'Chat' }]
})

module.exports = model('Chat', schema)