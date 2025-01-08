import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.ACCESS_SECRET_TOKEN_KEY, { expiresIn: maxAge })

}
export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.create({ email, password });
        const token = createToken(email, user.id);

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            },
            token // Send token in response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User with the given email not found");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).send("Password is incorrect");
        }

        const token = createToken(email, user.id);

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color,
                image: user.image
            },
            token // Send token in response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (req, res, next) => {
    console.log(req.userId);
    try {

        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send("User with the given id not founds")
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
        })


    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}
export const updateProfile = async (req, res, next) => {

    try {

        const { userId } = req;
        const { firstName, lastName, color } = req.body
        if (!firstName || !lastName || color === undefined) {
            return res.status(400).send("First name, Last Name, and color is Required. ")
        }
        const userData = await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true
            },
            {
                new: true,
                runValidators: true
            }
        )

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
        })


    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}

export const addProfileImage = async (req, res, next) => {
// profile
    try {

        console.log(req.file);

        if (!req.file) {
            return res.status(400).send("File is Required. ")
        }
        const date = Date.now()
        const fileName = `uploads/profiles/${date}_${req.file.originalname}`;
        renameSync(req.file.path, fileName);
        console.log(req.file.path);

        const updateUser = await User.findByIdAndUpdate(req.userId,
            {
                image: fileName
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            user: {

                image: updateUser.image
            }
        })


    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}
export const removeProfileImage = async (req, res, next) => {

    try {

        const { userId } = req;
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).send("User not found ")
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save();

        return res.status(200).send("Profile image removed successfully")

    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}

export const logOut = async (req, res, next) => {

    try {
        res.cookie("jwt", " ", { maxAge: 0, 
            httpOnly: true,
            secure:true,
            sameSite: 'None', })

        return res.status(200).send("Logout successfully")

    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}