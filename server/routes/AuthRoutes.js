import { Router } from "express";
import { addProfileImage, getUserInfo, login, logOut, removeProfileImage, signUp, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import multer from "multer";

// free tier of railway cookies not working
const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" })
authRoutes.post('/signup', signUp);
authRoutes.post('/login', login);
authRoutes.get('/user-info',  getUserInfo);
authRoutes.post('/update-profile',  updateProfile);
authRoutes.post('/add-profile-image',  upload.single("profile-image"), addProfileImage);
authRoutes.delete('/remove-profile-image', removeProfileImage);
authRoutes.post('/logout', logOut)


export default authRoutes;