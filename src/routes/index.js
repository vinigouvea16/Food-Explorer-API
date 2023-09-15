const {Router} = require("express");
const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes");
const ingredientsRoutes = require("./ingredients.routes");
const favoritesRoutes = require("./favorites.routes");
const orderRoutes = require("./order.routes");
const sessionsRoutes = require('./sessions.routes');
const routes = Router();

routes.use("/users", usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/order", orderRoutes);

module.exports = routes;