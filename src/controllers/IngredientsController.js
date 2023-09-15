const knex = require("../database/knex");

class IngredientsController{
  async index(req, res){
    const {dish_id} = req.params;
    const ingredients = await knex("ingredients")
    .where({dish_id})
    return res.json(ingredients);
  }
}
module.exports = IngredientsController;