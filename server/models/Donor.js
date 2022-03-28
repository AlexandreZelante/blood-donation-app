const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

const DonorSchema = new mongoose.Schema({
    name: String,
    telephone: String,
    email: {
        type: String,
        required: true
    },
    tipoSanguineo: String,
    location: {
        type: PointSchema,
        index: "2dsphere"
    },
    doacao: Boolean,
    ultimaDoacao: Date,
    notificacoes: [Number]
});

module.exports = mongoose.model("Donor", DonorSchema);
