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

    return res.json()
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
  async index(req, res){
    const {id, name, ingredients} = req.query;
    let dishes
    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredients => ingredients.trim())
      dishes = await knex("ingredients")
      .select([
        "dishes.id",
        "dishes.name"
      ])
      .whereLike("dishes.name", `%${name}%`)
      .whereIn("ingredients.name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
      .orderBy("dishes.name")
    } else{
      dishes = await knex("dishes")
      .where({id})
      .whereLike("name", `%${name}%`)
      .orderBy("name")
    }
    // const ingredientsDish = await knex("ingredients").where({id})
    // const dishIngredients = dishes.map(dish =>{
    // const dishIngredient = ingredientsDish.filter(ingredient => ingredient.dish_id === dish.id)
      
    //   return {
    //     ...dish,
    //     ingredients: dishIngredient
    //   }
    // })
      return res.json(dishes);
  }
}

module.exports = DishController
