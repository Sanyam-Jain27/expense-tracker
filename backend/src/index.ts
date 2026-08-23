import { configDotenv } from "dotenv";
configDotenv({path:"./.env"})

import connectDB from "./db";
import app from "./app"
const port =4001;

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`app is listening to : http://localhost:${port}`)
    })
})
.catch((error)=>{
    console.log("mongoDB connection Failed:",error.message)
})