const {Router} = require("express");
const usersRoutes = Router();
const UsersController = require("../controllers/UsersController");
const UsersValidatedController = require("../controllers/UsersValidatedController");
const ensureAuthentication = require('../middlewares/ensureAuthentication');

const usersController = new UsersController();
const usersValidatedController = new UsersValidatedController;

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthentication, usersController.update);
usersRoutes.get("/validated", ensureAuthentication, usersValidatedController.index);

module.exports = usersRoutes;