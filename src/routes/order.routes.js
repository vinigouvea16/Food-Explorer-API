const {Router} = require("express");
const orderRoutes = Router();
const OrderController = require("../controllers/OrderController");
const ensureAuthentication = require('../middlewares/ensureAuthentication');

const orderController = new OrderController();

orderRoutes.post("/", ensureAuthentication, orderController.create);

module.exports = orderRoutes;