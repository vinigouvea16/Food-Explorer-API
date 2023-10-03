const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const {compare} = require("bcryptjs");
const authConfig = require("../configs/auth");
const {sign} = require("jsonwebtoken");
class SessionsController {
  async create(req, res){
    const {email, password} = req.body
    const user = await knex("users").where({email}).first();
    if(!user){
      throw new AppError("E-mail ou senha incorreto(s)", 401)
    }
    const passwordMatch = await compare(password, user.password);
    if(!passwordMatch){
      throw new AppError("E-mail ou senha incorreto(s)", 401)
    }
    const {secret, expiresIn} = authConfig.jwt
    
    const token = sign({role: user.role}, secret, {
      subject: String(user.id),
      expiresIn
    })
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 15 * 60 * 1000
    });
    delete user.password
    
    res.status(201).json({user});
  }
}
module.exports = SessionsController;