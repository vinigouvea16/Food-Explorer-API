const {Router} = require("express");
const dishesRoutes = Router();
const DishController = require("../controllers/DishController");
const ensureAuthentication = require('../middlewares/ensureAuthentication');
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);
const DishImgController = require("../controllers/DishImgController");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishImgController = new DishImgController
const dishController = new DishController();
dishesRoutes.use(ensureAuthentication);

dishesRoutes.get("/", dishController.index);
dishesRoutes.post("/", verifyUserAuthorization("admin"), ensureAuthentication, dishController.create);
dishesRoutes.put("/:id", verifyUserAuthorization("admin"), ensureAuthentication ,dishController.update);
dishesRoutes.get("/:id", dishController.show);
dishesRoutes.delete("/:id", verifyUserAuthorization("admin"), dishController.delete);
dishesRoutes.patch("/plateimg/:id", verifyUserAuthorization("admin"), upload.single("plateimg"), dishImgController.update)

module.exports = dishesRoutes;