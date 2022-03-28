const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes.js");
const cors = require("cors");
const http = require("http");

const { setupWebsocket } = require("./websocket");

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@omnistack-6jh9d.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(cors());
app.use(express.json());

//Usa o Router do express
app.use(routes);

//Métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetros:

//Query Params: req.query (Filtros, ordenação, páginação, ...)
//Route Params: req.params (Identificar um recurso na alteração ou remoção)
//Body: req.body (Dados para criação ou alteração de um registro)

server.listen(3333);
