import dotenv from "dotenv"
import { server } from './db/socket.js'
import './app.js';

dotenv.config({
    path: './.env'
})
 
import connectDB from './db/index.js'

connectDB()
.then(()=> {
    server.listen(process.env.PORT || 8080, () => {
        console.log(`server is running on port: ${process.env.PORT}`);
    }) 
})
.catch((err) => {
    console.log("mongoDB connection failed!!", err);
})