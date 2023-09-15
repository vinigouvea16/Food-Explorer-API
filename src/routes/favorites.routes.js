const {Router} = require("express");
const favoritesRoutes = Router();
const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthentication = require('../middlewares/ensureAuthentication');
const favoritesController = new FavoritesController();

favoritesRoutes.post("/", ensureAuthentication, favoritesController.create);
favoritesRoutes.delete("/:id", favoritesController.delete);
favoritesRoutes.get("/", favoritesController.index);
favoritesRoutes.get("/:id", favoritesController.show);

module.exports = favoritesRoutes;