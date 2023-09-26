const knex = require("../database/knex");

class IngredientsController{
  async index(req, res) {
    const ingredients = await knex
      .select("ingredients.*")
      .from("ingredients")
      .join("dishes", "ingredients.dish_id", "=", "dishes.id")
      .orderBy("dishes.id"); 

    return res.json(ingredients);
  }
}
module.exports = IngredientsController;