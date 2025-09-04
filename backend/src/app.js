import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { app } from './db/socket.js';

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}))

app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '20kb' }))
app.use(express.static("public"))
app.use(cookieParser())

// import routes here
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js';

// declaration of routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

export { app };