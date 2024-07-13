import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const maxAge = 3* 24 * 60 * 60 * 1000;

const createToken = ( email, userId) => {
 return jwt.sign({email, userId}, process.env.ACCESS_SECRET_TOKEN_KEY, {expiresIn : maxAge})
 
}
export const signUp = async (req, res, next) => {
    try {
        const {email, password} = req.body
        console.log(req.body);
        if(!email || !password){
            return res.status(400).send("Email and password is Required")
        }
        const user = await User.create({email, password});
        res.cookie('jwt', createToken(email, user.id),{
            maxAge,
            httpOnly: true,
            secure : true,
            sameSite : "None"
        });
        return res.status(201).json({
            user : {
                id : user.id,
                email : user.email,
                profileSetup : user.profileSetup
            }
        })

    } catch (err) {
        console.log({ err });
        return res.status(500).send("Internal Server Error")
    }
}