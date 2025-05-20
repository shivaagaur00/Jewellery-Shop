import express from "express";
import dotenv from "dotenv";
import Database from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import ownerRouter from "./routes/owner.js";
const app= express();
dotenv.config();
app.use(cors());

Database();
app.use(bodyParser.json({extended: true }));
app.use(bodyParser.urlencoded({extended: true }));
app.use("/",ownerRouter);
app.listen(8000, () => {  
  console.log("Backend connected");
});
