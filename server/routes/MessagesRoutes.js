import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { getMessages } from "../controllers/MessagesController.js";

const messagesRoutes = Router();

messagesRoutes.post("/get-messages",getMessages);

export default messagesRoutes;