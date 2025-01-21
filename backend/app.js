import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/userRoutes.js"
import chatRoute from "./routes/chatRoutes.js"
import messageRoute from "./routes/messageRoutes.js"



const app = express();
config({})
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

connection()
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);

app.use(errorMiddleware)

export default app
