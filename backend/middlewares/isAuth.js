import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: "Invalid or missing token" });
        }
       
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyToken) {
            return res.status(400).json({ message: "User doesn't have valid token" });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

export default isAuth;
