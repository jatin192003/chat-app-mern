import { User } from "../models/userModel.js";
import { asyncHandler } from "../middleware/asyncHandler.js"
import ErrorHandler from "../middleware/errorMiddleware.js";
import jwt from "jsonwebtoken"




const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken(); // Generate a new refresh token

        user.refreshToken = newRefreshToken; // Update with the new refresh token
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken: newRefreshToken }; // Return the new refresh token

    } catch (error) {
        return next(new ErrorHandler("Something went wrong while generating refresh & access token", 500));
    }
}

export const register = asyncHandler(async (req, res, next) => {
    try {
        const { fullName, email, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !email || !username || !password || !confirmPassword || !gender) {
            return next(new ErrorHandler("all fields are required while registering user", 400))
        }
        if (password !== confirmPassword) {
            return next(new ErrorHandler("password must match", 400))
        }
        const user = await User.findOne({ username });
        if (user) {
            return next(new ErrorHandler("username already taken", 400))
        }
        const emailID = await User.findOne({ email });
        if (emailID) {
            return next(new ErrorHandler("email already exists", 400))
        }
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`
        const newUser = await User.create({ fullName, username, email, password, gender, profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto })
        const createdUser = await User.findById(newUser._id).select("-password")
        return res.status(200).json({
            success: true,
            message: "user registered successfully",
            createdUser
        })
    } catch (error) {
        console.log(error);
    }
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return next(new ErrorHandler("user not found", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User Logged In Successfully",
            loggedInUser
        })
})

export const logout = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success: true,
        message: "User Logged Out Successfully"
    })
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ErrorHandler("Unauthorized Request", 401));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return next(new ErrorHandler("Invalid Refresh Token", 401));
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return next(new ErrorHandler("Refresh Token is expired or used", 401));
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken(); // Generate a new refresh token here

        // Update user with the new refresh token
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options) // Send the new refresh token
            .json({
                success: true,
                message: "Access Token Refreshed Successfully"
            });
    } catch (error) {
        return next(new ErrorHandler(error?.message || "Invalid Refresh Token", 401));
    }
});

export const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect){
        return next(new ErrorHandler("Inavlid Old Password", 400))
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res.status(200)
    .json({
        success: true,
        message:"password changed successfully"
    })
})

export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    
    res.status(200).json({
        success: true,
        user,
    });
});

export const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password -refreshToken");
    res.send(users);
  });
