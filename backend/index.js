import express from "express";
import dotenv from "dotenv";
import Database from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import ownerRouter from "./routes/owner.js";
import router from "./routes/authRoutesCustomer.js";
import geminiRouter from './routes/geminiRoutes.js';
const app= express();
dotenv.config();
app.use(cors());
app.use(express.json());
Database();
app.use(bodyParser.json({extended: true }));
app.use(bodyParser.urlencoded({extended: true }));

app.use("/",ownerRouter);
app.use("/",geminiRouter);

app.use('/', router);
app.listen(8000, () => {  
  console.log("Backend connected");
});
