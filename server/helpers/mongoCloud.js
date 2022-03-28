const MongoClient = require("mongoose");
const Donor = require("../models/Donor");
const Notification = require("../models/Notification");
const distanceInKm = require("../utils/calculateDistance.js");
const assert = require("assert");
const util = require("util");
const cfenv = require("cfenv");
const { findConnections, sendMessage } = require("../websocket");
let vcapLocal;
try {
    vcapLocal = require("./vcap-local.json");
    console.log("Loaded local VCAP");
} catch (e) {
    // console.log(e)
}
const appEnvOpts = vcapLocal
    ? {
          vcap: vcapLocal
      }
    : {};

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Within the application environment (appenv) there's a services object
let services = appEnv.services;

// The services object is a map named by service so we extract the one for MongoDB
let mongodbServices = services["databases-for-mongodb"];

// This check ensures there is a services for MongoDB databases
assert(
    !util.isUndefined(mongodbServices),
    "App must be bound to databases-for-mongodb service"
);

// We now take the first bound MongoDB service and extract it's credentials object
let mongodbConn = mongodbServices[0].credentials.connection.mongodb;

// Read the CA certificate and assign that to the CA variable
let ca = [Buffer.from(mongodbConn.certificate.certificate_base64, "base64")];

// We always want to make a validated TLS/SSL connection
let options = {
    ssl: true,
    sslValidate: true,
    sslCA: ca,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Extract the database username and password
let authentication = mongodbConn.authentication;
let username = authentication.username;
let password = authentication.password;

// Extract the MongoDB URIs
let connectionPath = mongodbConn.hosts;
let connectionString = `mongodb://${username}:${password}@${connectionPath[0].hostname}:${connectionPath[0].port},${connectionPath[1].hostname}:${connectionPath[1].port}/?replicaSet=replset`;

function addDoc(
    name,
    telephone,
    email,
    tipoSanguineo,
    longitude,
    latitude,
    doacao,
    ultimaDoacao
) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        let doc = await Donor.findOne({ email }, (err, res) => {
            if (err) reject({ message: "Erro ao buscar o doador." });
        });
        if (!doc) {
            donor = {
                name,
                telephone,
                email,
                tipoSanguineo,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                doacao,
                ultimaDoacao,
                notificacoes: []
            };
            let notifications = await Notification.find((err, res) => {
                if (err) reject({ message: "Erro ao buscar as notificações." });
            });
            notifications.map((notification) => {
                if (
                    distanceInKm(
                        (latitude, longitude),
                        (notification.location.coordinates[1],
                        notification.location.coordinates[0])
                    ) <=
                    notification.distancia / 1000
                ) {
                    donor.notificacoes.push(notification.id);
                }
            });
            await Donor.create(donor, (err) => {
                if (err) reject({ message: "Erro ao criar o doador." });
            });
            resolve(donor);
        } else {
            reject({ message: "Email já cadastrado" });
        }
    });
}

function updateDoc(
    name,
    telephone,
    email,
    tipoSanguineo,
    longitude,
    latitude,
    doacao,
    ultimaDoacao
) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        let doc = {};
        doc = await Donor.findOne({ email }, (err) => {
            if (err) reject({ message: "Erro ao procurar doador." });
        });
        if (doc) {
            doc.name = name;
            doc.telephone = telephone;
            doc.tipoSanguineo = tipoSanguineo;
            doc.location = {
                type: "Point",
                coordinates: [longitude, latitude]
            };
            doc.doacao = doacao;
            doc.ultimaDoacao = ultimaDoacao;
            doc.notificacoes = [];
            let notifications = await Notification.find();
            notifications.map((notification) => {
                if (
                    distanceInKm(
                        (latitude, longitude),
                        (notification.location.coordinates[1],
                        notification.location.coordinates[0])
                    ) <=
                    notification.distancia / 1000
                ) {
                    donor.notificacoes.push(notification.id);
                }
            });
            Donor.updateOne({ email }, doc, (err, data) => {
                if (err) reject(err);
                resolve(doc);
            });
        } else {
            resolve("Não encontrado");
        }
    });
}

function deleteDoc(email) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        const doc = await Donor.findOne({ email }, (err) => {
            if (err) reject({ message: "Erro ao procurar o doador." });
        });
        if (doc) {
            await Donor.deleteOne({ email }, (err) => {
                if (err) reject({ message: "Erro ao deletar o doador." });
            });
        } else {
            resolve("Não encontrado");
        }
        resolve(doc);
    });
}

function addNotToDonor(donor, id) {
    return new Promise(async (resolve, reject) => {
        donor.notificacoes.push(id);
        await Donor.updateOne({ email: donor.email }, donor, (err) => {
            if (err) reject({ message: "Erro ao adicionar a notificação." });
        });
        resolve(true);
    });
}

function mapDonorsNot(donors, id) {
    return Promise.all(donors.map(async (donor) => addNotToDonor(donor, id)));
}

function addNotification(
    text,
    longitude,
    latitude,
    dataInicio,
    dataFim,
    endereco,
    distancia
) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        let result = await Notification.find({}, (err) => {
            if (err)
                reject({
                    message:
                        "Erro ao procurar uma notificação existente no banco."
                });
        }).distinct("id");
        let id;
        if (result.length > 0) id = Math.max.apply(null, result) + 1;
        else id = 0;
        await Notification.create(
            {
                id,
                text,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                dataInicio,
                dataFim,
                endereco,
                distancia
            },
            (err) => {
                if (err)
                    reject({ message: "Erro ao adicionar a notificação." });
            }
        );
        let donors = await Donor.find(
            {
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: distancia
                    }
                }
            },
            (err) => {
                if (err) reject({ message: "Erro ao procurar os doadores." });
            }
        );
        mapDonorsNot(donors, id).then(async (data) => {
            result = await Notification.find({ id }, (err) => {
                if (err) reject({ message: "Erro ao procurar a notificação." });
            });
            resolve(result);
        });
    });
}

function updNotToDonor(donor, id, latitude, longitude) {
    return new Promise(async (resolve, reject) => {
        let distanciaNot = distanceInKm(
            (latitude, longitude),
            (donor.location.coordinates[1], donor.location.coordinates[0])
        );
        if (
            distanciaNot <= distancia / 1000 &&
            donor.notificacoes.indexOf(id) == -1
        ) {
            donor.notificacoes.push(notification.id);
            await Donor.updateOne({ email: donor.email }, donor);
            resolve(true);
        } else if (
            distanciaNot > distancia / 1000 &&
            donor.notificacoes.indexOf(id) != -1
        ) {
            donor.notificacoes = donor.notificacoes.filter((value) => {
                if (value != id) {
                    return value;
                }
            });
            await Donor.updateOne({ email: donor.email }, donor, (err) => {
                if (err) reject({ message: "Erro ao atualizar os doadores." });
            });
            resolve(true);
        } else {
            resolve(true);
        }
    });
}

function updMapDonorsNot(donors, id, latitude, longitude) {
    return Promise.all(
        donors.map((donor) => updNotToDonor(donor, id, latitude, longitude))
    );
}

function updateNotification(
    id,
    text,
    longitude,
    latitude,
    dataInicio,
    dataFim,
    endereco,
    distancia
) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        let result = await Notification.find({ id }, (err) => {
            if (err) reject({ message: "Erro ao procurar a notificação." });
        });
        if (result) {
            await Notification.updateOne(
                { id },
                {
                    text,
                    dataInicio,
                    dataFim,
                    "location.coordinates": [longitude, latitude],
                    endereco,
                    distancia
                },
                (err) => {
                    if (err)
                        reject({ message: "Erro ao atualizar a notificação." });
                }
            );
            let donors = await Donor.find((err) => {
                if (err) reject({ message: "Erro ao procurar os doadores." });
            });
            updMapDonorsNot(donors, id, latitude, longitude).then(
                async (data) => {
                    (result = await Notification.find({ id })),
                        (err) => {
                            if (err)
                                reject({
                                    message:
                                        "Erro ao procurar a notificação atualizada."
                                });
                        };
                    resolve(result);
                }
            );
        }
        reject("id não encontrado");
    });
}

function removeNotToDonor(donor, id) {
    return new Promise(async (resolve, reject) => {
        if (donor.notificacoes.indexOf(id) != -1) {
            donor.notificacoes = donor.notificacoes.filter((value) => {
                if (value != id) {
                    return value;
                }
            });
            await Donor.updateOne({ email: donor.email }, donor, (err) => {
                if (err) reject({ message: "Erro ao atualizar o doador." });
            });
            resolve(true);
        } else {
            resolve(true);
        }
    });
}

function mapRemoveDonorsNot(donors, id) {
    return Promise.all(
        donors.map(async (donor) => removeNotToDonor(donor, id))
    );
}

function deleteNotification(id) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        await Notification.deleteOne({ id }, (err) => {
            if (err) reject({ message: "Erro ao procurar os doadores." });
        });
        let donors = await Donor.find();
        mapRemoveDonorsNot(donors, id).then((data) => {
            resolve({ success: true });
        });
    });
}

function removeAllNotToDonor(donor) {
    return new Promise(async (resolve, reject) => {
        donor.notificacoes = [];
        await Donor.updateOne({ email: donor.email }, donor, (err) => {
            if (err) reject({ message: "Erro ao atualizar o doador." });
        });
        resolve(true);
    });
}

function mapRemoveDonorsNots(donors) {
    return Promise.all(donors.map(async (donor) => removeAllNotToDonor(donor)));
}

function deleteNotifications() {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        await Notification.deleteMany({}, (err) => {
            if (err) reject({ message: "Erro ao deletar notificacoes." });
        });
        let donors = await Donor.find();
        mapRemoveDonorsNots(donors).then((data) => {
            resolve({ success: true });
        });
    });
}

function returnDoc(email) {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        let doc = await Donor.findOne({ email }, (err) => {
            if (err) reject({ message: "Erro ao procurar o doador." });
        });
        if (doc) {
            var mysort = { id: -1 };
            let notifications = await Notification.find(
                {
                    id: { $in: doc.notificacoes }
                },
                (err) => {
                    if (err)
                        reject({
                            message: "Erro ao procurar as notificações."
                        });
                }
            ).sort(mysort);
            resolve({ doc, notifications });
        }
        resolve(null);
    });
}

function returnDocs() {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        const docs = await Donor.find((err) => {
            if (err) reject({ message: "Erro ao procurar os doadores." });
        });
        resolve(docs);
    });
}

function returnNotifications() {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(connectionString, options);
        Notification.find()
            .sort({ id: -1 })
            .exec((err, docs) => {
                if (err)
                    reject({ message: "Erro ao procurar as notificações." });
                resolve(docs);
            });
    });
}

function returnDocsDistance(latitude, longitude, distancia) {
    return new Promise(async (resolve, reject) => {
        const donor = await Donor.find(
            {
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: distancia
                    }
                }
            },
            (err) => {
                if (err) reject({ message: "Erro ao procurar os doadores." });
            }
        );

        resolve({ donor });
    });
}

function sendMessageDistance(latitude, longitude, distancia) {
    return new Promise(async (resolve, reject) => {
        const sendSocketMessageTo = findConnections(
            { latitude, longitude },
            distancia
        );
        console.log(sendSocketMessageTo);
        sendMessage(sendSocketMessageTo, "Teste", "Teste");
        resolve({ success: true });
    });
}

module.exports = {
    updateDoc,
    returnDoc,
    returnDocs,
    deleteDoc,
    addDoc,
    returnDocsDistance,
    sendMessageDistance,
    addNotification,
    deleteNotification,
    updateNotification,
    returnNotifications,
    deleteNotifications
};
