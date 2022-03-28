const Donor = require("../models/Donor");

module.exports = {
    async index(req, res) {
        const { latitude, longitude, distancia } = req.query;

        const donor = await Donor.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: distancia
                }
            }
        });

        console.log(donor);

        res.json({ donor });
    }
};
