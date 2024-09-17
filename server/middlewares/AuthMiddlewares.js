import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer [token]"

    if (!token) {
        return res.status(401).send("You are not authenticated!");
    }

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token is not valid!');
        }
        req.userId = decoded.userId;
        next();
    });
}
