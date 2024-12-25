import mongoose from "mongoose";
import bcrypt from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken"

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide valid email."],
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true });



userModel.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

userModel.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userModel.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userModel.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userModel)