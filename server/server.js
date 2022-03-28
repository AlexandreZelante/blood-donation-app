// import dependencies and initialize express
const express = require("express");
const path = require("path");
const cors = require("cors");
// const axios = require("axios");
// var url = require("url");
var db = require("./helpers/mongoCloud");
// const DonorController = require("./controllers/DonorController");

const app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

// enable parsing of http request body
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// access to static files
app.use(express.static(path.join(__dirname, "..", "client", "build")));

io.on("connection", function(socket) {
    console.log("connected");
});

// const { setupWebsocket } = require("./websocket");

// setupWebsocket(server);

app.get("/getDonors", async (req, res) => {
    let result = await db.returnDocs();

    res.send(result);
});

app.get("/getNotifications", async (req, res) => {
    let result = await db.returnNotifications();

    res.send(result);
});

app.post("/getDonor", async (req, res) => {
    const { email } = req.body;

    let result = await db.returnDoc(email);

    res.send(result);
});

app.post("/getDonorsDistance", async (req, res) => {
    const { distancia, location } = req.body;

    let result = await db.returnDocsDistance(
        location.coordinates[1],
        location.coordinates[0],
        distancia
    );

    res.send(result);
});

app.post("/sendMessageDonors", async (req, res) => {
    const { distancia, location } = req.body;

    let result = await db.sendMessageDistance(
        location.coordinates[1],
        location.coordinates[0],
        distancia
    );

    res.send(result);
});

app.post("/addDonor", async (req, res) => {
    const {
        name,
        telephone,
        email,
        tipoSanguineo,
        currentRegion,
        doacao,
        ultimaDoacao
    } = req.body;

    let result = await db.addDoc(
        name,
        telephone,
        email,
        tipoSanguineo,
        currentRegion.longitude,
        currentRegion.latitude,
        doacao,
        ultimaDoacao
    );

    res.send(result);
});

app.post("/updateDonor", async (req, res) => {
    const {
        name,
        telephone,
        email,
        tipoSanguineo,
        currentRegion,
        doacao,
        ultimaDoacao
    } = req.body;

    let result = await db.updateDoc(
        name,
        telephone,
        email,
        tipoSanguineo,
        currentRegion.longitude,
        currentRegion.latitude,
        doacao,
        ultimaDoacao
    );

    res.send(result);
});

app.post("/deleteDonor", async (req, res) => {
    const { email } = req.body;

    let result = await db.deleteDoc(email);

    res.send(result);
});

app.post("/addNotification", async (req, res) => {
    const {
        texto,
        currentRegion,
        dataInicio,
        dataFim,
        endereco,
        distancia
    } = req.body;

    let dateInicio = new Date(dataInicio);
    let dateFim = new Date(dataFim);

    let result = await db.addNotification(
        texto,
        currentRegion.longitude,
        currentRegion.latitude,
        dateInicio,
        dateFim,
        endereco,
        distancia
    );

    res.send(result);
});

app.post("/updateNotification", async (req, res) => {
    const {
        id,
        texto,
        currentRegion,
        dataInicio,
        dataFim,
        endereco,
        distancia
    } = req.body;

    let dateInicio = new Date(dataInicio);
    let dateFim = new Date(dataFim);

    // let dateParts = dataInicio.split("/");

    // let dateInicio = new Date(
    //     +dateParts[2].split(" ")[0],
    //     dateParts[1] - 1,
    //     +dateParts[0],
    //     dateParts[2].split(" ")[1].split(":")[0],
    //     dateParts[2].split(" ")[1].split(":")[1]
    // );

    // dateInicio.setHours(dateInicio.getHours() - 3);

    // dateParts = dataFim.split("/");
    // let dateFim = new Date(
    //     +dateParts[2].split(" ")[0],
    //     dateParts[1] - 1,
    //     +dateParts[0],
    //     dateParts[2].split(" ")[1].split(":")[0],
    //     dateParts[2].split(" ")[1].split(":")[1]
    // );

    // dateFim.setHours(dateFim.getHours() - 3);

    let result = await db.updateNotification(
        id,
        texto,
        currentRegion.longitude,
        currentRegion.latitude,
        dateInicio,
        dateFim,
        endereco,
        distancia
    );

    res.send(result);
});

app.post("/deleteNotification", async (req, res) => {
    const { id } = req.body;

    let result = await db.deleteNotification(id);

    res.send(result);
});

app.delete("/deleteNotifications", async (req, res) => {
    let result = await db.deleteNotifications();

    res.send(result);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// start node server
const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`App UI available http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../public", "404.html"));
});

module.exports = app;
