import jwt, { decode } from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    console.log( "cookie" ,req.cookies);
    const token = req.cookies?.jwt
    if (!token) {
        return res.status(401).send("You are not authenticated!")
    }
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token is not valid!')
        }
        req.userId = decoded.userId
        next()
    })
}