const {hash, compare} = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
class UsersController {
  async create(req, res){
    const {name, email, password} = req.body;
    const checkUserExists = await knex("users").where({ email });

    if (checkUserExists.length > 0) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

     await knex("users").insert({ name, email, password: hashedPassword});

    return res.status(201).json();
  }

  async update(req, res){
    const {name, email, password, old_password, address} = req.body;
    const user_id = req.user.id;
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
    if(!user){
      throw new AppError("Usuário não encontrado");
    }
    // const userWithUpdatedEmail = await knex("users").where(email);
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Esse email já está em uso")
    }

    if(password && !old_password){
      throw new AppError("Você precisa da senha antiga pra atualizá-la")
    }
    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password);
      
    if(!checkOldPassword){
        throw new AppError("Senha antiga não confere")
      }
      user.password = await hash(password, 8);
    }
    

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.address = address ?? user.address;

    await database.run(`
    UPDATE users SET 
    name = ?,
    email = ?,
    password = ?,
    address = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, user.address, user_id]
    );

    return res.status(200).json();
  }
}

module.exports = UsersController;