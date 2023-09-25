const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishImgController{
  async update(req, res){
    const user_id = req.user.id;
    const {id} = req.params
    const dishFilename = req.file.filename;
    const diskStorage = new DiskStorage();
    const user = await knex("users").where({id: user_id}).first();
    if(!user){
      throw new AppError("Somente usuários autenticados podem alterar imagem do prato", 401)
    }
    const dish = await knex("dishes").where({id}).first();
    if(dish.image){
      await diskStorage.deleteFile(dish.image);
    }
    const filename = await diskStorage.saveFile(dishFilename);
    dish.image = filename;
    await knex("dishes").update(dish).where({id})
    return res.json(dish);
  }
}
module.exports = DishImgController;