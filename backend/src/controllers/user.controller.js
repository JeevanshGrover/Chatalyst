import jwt from 'jsonwebtoken'
import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error generating tokens:");
    }
}

const signup = async (req, res) => {
    const { username, email, fullName, password } = req.body;
    try {
        if(
            [fullName, username, email, password].some((field) => field?.trim() === "")
        ){
            return res.status(400).json({message: "all fields are required"});
        }

        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })
        if(existingUser){
            return res.status(409).json({message: "user already exists"})
        }

        const user = await User.create({
            fullName,
            username:username.toLowerCase(),
            email,
            password,
            profilePic
        })

        if(!user){
            return res.status(500).json({message: "something went wrong while creating the user"});
        }

        return res
        .status(200)
        .json({
            message: "user created successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        })

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({message: "internal server error"});
    }
}   

const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email){
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user nor found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, "invalid login credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logout = asyncHandler(async (req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            },
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
    .json(
        new ApiResponse(200, {}, "user logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized requesr")
    }

    //verify the refresh token
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "invalid refresh token");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            200,
            {
                accessToken,
                refreshToken: newRefreshToken
            },
            "access token refreshed successully"
        )

    } catch (error) {
        throw new ApiError(500, error?.message || "unable to refresh the access token")
    }
})

export{
    signup,
    login,
    logout,
    refreshAccessToken
}