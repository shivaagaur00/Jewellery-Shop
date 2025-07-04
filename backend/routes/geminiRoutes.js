import { Router } from "express";
const geminiRouter=Router();
import {generateResponse} from "./../controllers/geminiControllers.js";
geminiRouter.post("/metalRate",generateResponse);
export default geminiRouter;