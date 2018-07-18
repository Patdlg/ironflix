const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const comentariosSchema = new Schema({
    peli: String,
    user:
    {
        type: Schema.Types.ObjectId,
        ref: 'user',
        childPath: "comments"
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }

}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

module.exports = mongoose.model('comments', comentariosSchema);