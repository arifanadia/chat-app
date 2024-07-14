import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);


export default contactsRoutes;