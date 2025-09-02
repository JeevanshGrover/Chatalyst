import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from "mongoose";

const getUsersForSidebar = asyncHandler(async(req, res) => {
    const loggedInUserId = req.user._id;
    // const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password -refreshToken");
    const { page = 1, limit = 10 } = req.query;
    
    const aggregate = User.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose.Types.ObjectId(loggedInUserId) } 
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

    const filteredUsers = await User.aggregatePaginate(aggregate, options);

    if(!filteredUsers || filteredUsers.docs.length === 0) {
        throw new ApiError(404, "No users found");
    }

    const response = {
        users: filteredUsers.docs,
        totalUsers: filteredUsers.totalDocs,
        totalPages: filteredUsers.totalPages,
        currentPage: filteredUsers.page,
        hasNextPage: filteredUsers.hasNextPage,
        hasPrevPage: filteredUsers.hasPrevPage
    }

    return res
    .status(200)
    .json(new ApiResponse(200, response, "Users fetched successfully"));
})

const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChat } = req.params;
    const senderId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    try {
        const aggregateQuery = Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(senderId), receiver: new mongoose.Types.ObjectId(userToChat) },
                        { sender: new mongoose.Types.ObjectId(userToChat), receiver: new mongoose.Types.ObjectId(senderId) }
                    ]
                }
            },
            {
                $sort: {createdAt: -1}
            }
        ]);
    
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }
    
        const messages = await Message.aggregatePaginate(aggregateQuery, options);
    
        if (!messages || messages.docs.length === 0) {
            throw new ApiError(404, "No messages found");
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "An error occurred while fetching messages");
    }
})

const sendMessage = asyncHandler(async (req, res) => {
    const {text, mediaFile} = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if(!text && !mediaFile){
        throw new ApiError(400, "cannot send empty message");
    }

    const newMessage = await new Message.create({
        senderId: senderId,
        receiver: receiverId,
        text: text? text : "",
        mediaFile: mediaFile ? {
            url: mediaFile.secure_url,
            publicId: mediaFile.public_id
        } : null 
    })

    return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "message sent successfully"));
})

export{
    getUsersForSidebar,
    getMessages,
    sendMessage
}