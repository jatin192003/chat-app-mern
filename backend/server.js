import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log("server is listening at port", process.env.PORT);
    
})