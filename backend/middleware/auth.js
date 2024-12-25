import jwt from "jsonwebtoken";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token){
            return next(new ErrorHandler("Unauthorized Request", 400))
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id ).select("-password -refereshToken")
    
    
        if(!user){
            return next(new ErrorHandler("Invalid Access Token", 401))
        }
    
        req.user = user;
        next()
    } catch (error) {
        return next(new ErrorHandler(error?.message || "Invalid Access Token", 401))
    }
  });