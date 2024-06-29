import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decode); // Debug statement to log decoded token
            
            req.user = await User.findById(decode.userId).select('-password');
            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }
            
            // console.log("Authenticated user:", req.user); // Debug statement to log authenticated user
            next();
        } catch (error) {
            // console.error("JWT verification failed:", error.message); // Debug statement for verification error
            res.status(401);
            throw new Error("Not Authorized User, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not Authorized & No Token");
    }
});

// check if the user is admin or not
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isadmin) {
        next();
    } else {
        res.status(401).send("Not Authorized As A Admin");
    }
};

export { authenticate, authorizeAdmin };
