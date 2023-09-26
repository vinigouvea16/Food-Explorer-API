const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
class DishController{
  async create(req, res){
    const {name, description, price, ingredients, category} = req.body;
    const [dish_id] = await knex("dishes").insert({
      name,
      description,
      price,
      category
    })

    const ingredientsInsert = ingredients.map(name => {
      return{
        dish_id,
        name
      }
    })
    await knex("ingredients").insert(ingredientsInsert)

    return res.status(201).json({dish_id})
  }
  async show(req, res){
    const {id} = req.params;
    const dish = await knex("dishes").where({id}).first();
    const ingredients = await knex("ingredients").where({dish_id:id}).orderBy("name");

    return res.json({
      ...dish,
      ingredients
    });
  }
  async delete(req, res){
    const {id} = req.params;
    await knex("dishes").where({id}).delete();

    return res.json();
  }
  async update(req, res){
    const {name, description, price, category} = req.body;
    const {id} = req.params;
    const database = await sqliteConnection();
    const dish = await database.get("SELECT * FROM dishes WHERE id=(?)", [id])
    if(!dish){
      throw new AppError("Prato não encontrado")
    }
    if (name !== undefined) {
      dish.name = name;
    }
    if (description !== undefined) {
      dish.description = description;
    }
    if (price !== undefined) {
      dish.price = price;
    }
    if (category !== undefined) {
      dish.category = category;
    }
    dish.name = name ?? dish.name;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;
    await database.run(`
    UPDATE dishes SET
    name = ?,
    description = ?,
    price = ?,
    category = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [dish.name, dish.description, dish.price, dish.category, id]
    );
    return res.status(200).json({message: 'Prato atualizado com sucesso', id});
  }
  async index(req, res) {
    const { name, ingredients, category } = req.query;
    let dishes;
  
    if (ingredients) {
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.category"
        ])
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .orderBy("dishes.name");
    } else if (name) {
      dishes = await knex("dishes")
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    } else if (category) { // Perform a case-insensitive search for category
      dishes = await knex("dishes")
        .whereLike("category", `%${category}%`)
        .orderBy("name");
    } else {
      dishes = await knex("dishes").orderBy("name");
    }
  
    return res.json(dishes);
  }
}

module.exports = DishController
