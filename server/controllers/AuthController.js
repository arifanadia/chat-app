import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs';

const maxAge = 3 * 24 * 60 * 60 * 1000; // This value is no longer used if you're not setting cookies

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }
        const user = await User.create({ email, password });
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup 
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).send("User with the given email not found.");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).send("Password is incorrect.");
        }
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color,
                image: user.image
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async (req, res, next) => {
    console.log(req.userId);
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with the given id not found.");
        }
        return res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                color: userData.color,
                image: userData.image
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName || color === undefined) {
            return res.status(400).send("First name, last name, and color are required.");
        }
        const userData = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            color,
            profileSetup: true
        }, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                color: userData.color,
                image: userData.image
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const addProfileImage = async (req, res, next) => {
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).send("File is required.");
        }
        const date = Date.now();
        const fileName = `uploads/profiles/${date}_${req.file.originalname}`;
        renameSync(req.file.path, fileName);
        console.log(req.file.path);
        const updateUser = await User.findByIdAndUpdate(req.userId, {
            image: fileName
        }, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            user: {
                image: updateUser.image
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }
        if (user.image) {
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
        return res.status(200).send("Profile image removed successfully.");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const logOut = async (req, res, next) => {
    try {
  
        return res.status(200).send("Logout successful.");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
