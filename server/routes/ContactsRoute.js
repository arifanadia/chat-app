import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { getContactsForDmList, searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search",searchContacts);
contactsRoutes.get("/get-contacts-for-dm",  getContactsForDmList);


export default contactsRoutes;