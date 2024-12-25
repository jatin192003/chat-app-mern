import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/userRoutes.js"



const app = express();
config({})
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

connection()
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute)

app.use(errorMiddleware)

export default app
