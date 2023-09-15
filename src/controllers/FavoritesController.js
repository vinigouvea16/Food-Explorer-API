const knex = require("../database/knex");
const AppError = require("../utils/AppError");
class FavoritesController {
  async create(req, res){
    const {dish_id} = req.body;
    const user_id = req.user.id;
    const checkIfDishExists = await knex("dishes").where({id: dish_id})
    if(!checkIfDishExists){
      throw new AppError("Esse prato não existe") 
    }
    await knex("favorites").insert({
      dish_id,
      user_id
    })
    return res.status(201).json();
  }
  async show(req, res){
    const {id} = req.params;
    const favorites = await knex("favorites").where({id}).first();
    const dishes = await knex("dishes").where({id}).orderBy("name");
    return res.json({
      ...favorites,
      dishes
    })
  }
  async delete(req, res){
    const {id} = req.params;
    await knex("favorites").where({id}).delete();
    
    return res.json();
  }
  async index(req, res){
    const {user_id} = req.query;
    const favorites = await knex("favorites")
    .where({user_id})
    .orderBy("dish_id");

    return res.json(favorites);
    // const {name, dishes} = req.query;
    // const user_id = req.user.id;
    // let favorites;
    // if (dishes){
    //   const filterDishes = dishes.split(',').map(dish => dish.trim());
    //   favorites = await knes("dishes")
    //   .select([
    //     "dishes.id",
    //     "dishes.name",
    //     "dishes.user_id",
    //   ])
    //   .where("dishes.user_id", user_id)
    //   .whereLike("dishes.name", `%${name}%`)
    //   .whereIn("name", filterDishes)
    //   .innerJoin("dishes", "dishes.id", "favorites.dish_id")
    //   .groupBy("dishes.id")
    //   .orderBy("dishes.name")
    //   dishes = await knex("dishes")
    //   .where({user_id})
    //   .whereLike("name", `%${name}%`)
    //   .orderBy("name");
    // }
    // return res.json(favorites);    
  }
}

module.exports = FavoritesController;