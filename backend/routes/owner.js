import { Router } from "express";
import { addCustomer, addItem, addLoan, deleteItem, deleteLoan, getCustomers, getItems, getLoans, getSpecificCustomer, ownerLogin, updateItem, updateLoan } from "../controllers/authController.js";
import { addSale } from "../controllers/salesControllers.js";
const ownerRouter=Router();
ownerRouter.post("/ownerLogin",ownerLogin);
ownerRouter.post("/getItems",getItems);
ownerRouter.post("/getLoans",getLoans);
ownerRouter.post("/updateItem",updateItem);
ownerRouter.post("/deleteItem",deleteItem);
ownerRouter.post("/addItem",addItem);
ownerRouter.post("/updateLoan",updateLoan);
ownerRouter.post("/deleteLoan",deleteLoan);
ownerRouter.post("/addLoan",addLoan);
ownerRouter.post("/addCustomer",addCustomer)
ownerRouter.post("/getCustomers",getCustomers);
ownerRouter.post("/getSpecificCustomer",getSpecificCustomer);
ownerRouter.post("/addSale",addSale);
export default ownerRouter;