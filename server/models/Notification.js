const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

const NotificationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    location: {
        type: PointSchema,
        index: "2dsphere",
        required: true
    },
    dataInicio: {
        type: Date,
        required: true
    },
    dataFim: {
        type: Date,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    distancia: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Notification", NotificationSchema);
