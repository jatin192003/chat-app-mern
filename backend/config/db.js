import mongoose from "mongoose";

export const connection = ()=>{
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: "CHAT_APPLICATION_MERN"
    }).then(()=>{
        console.log("Connected to database.")
    }).catch(err=>{
        console.log(`Some error occured while connecting to database: ${err}`)
    })
}