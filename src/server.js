require("express-async-errors");

const cors = require("cors")
const express = require("express");
const routes = require("./routes");
const migrationsRun = require("./database/sqlite/migrations");
migrationsRun();
const path = require("path");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/files', express.static(path.resolve(__dirname, '..' ,'tmp', 'uploads')));
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173/'],
    credentials: true
  }));
app.use(routes);
app.use((error, req, res, next)=>{
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    status:"error",
    message:"internal server error",
  })
})

const PORT = 3333;
app.listen(PORT, ()=> console.log(`🍜🌐Server is running on Port ${PORT}`));