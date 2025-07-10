const { Schema, default: mongoose } = require("mongoose");

const DaftarHadirScheme = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    absenDate: {
        type: Date,
        required: true
    },
    longCordinate: {
        type: Number,
        required: true
    },
    latCordinate: {
        type: Number,
        required: true,
    },
    messageText: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const DaftarHadir = mongoose.model('DaftarHadir', DaftarHadirScheme);
module.exports = DaftarHadir;
