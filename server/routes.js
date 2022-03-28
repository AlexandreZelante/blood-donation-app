const { Router } = require("express");
const DonorController = require("./controllers/DonorController");
const SearchController = require("./controllers/SearchController");

const routes = Router();

routes.get("/devs", DonorController.index);
routes.post("/devs", DonorController.store);

routes.get("/search", SearchController.index);

module.exports = routes;
