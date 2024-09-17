import { Router } from "express";
import { addProfileImage, getUserInfo, login, logOut, removeProfileImage, signUp, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" })
authRoutes.post('/signup', signUp);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/add-profile-image', verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage);
authRoutes.post('/logout', logOut)


export default authRoutes;