// Packages
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import path from "path"

//Files

import dbConnection from "./config/dbconnection.js";
import userRoutes from "./routes/userRoutes.js";


//Configurations
dotenv.config()
dbConnection()
const app = express()


//middlewares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


const PORT = process.env.PORT || 4000


//Routes
app.use('/api/v1/users', userRoutes)


app.listen(PORT,()=>{ console.log(`Server Running At ${PORT}`) })
