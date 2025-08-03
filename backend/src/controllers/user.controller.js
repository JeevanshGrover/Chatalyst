import express from "express"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"
import { User } from "../models/user.model.js"

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


export{
    signup
}