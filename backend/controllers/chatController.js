import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const accessChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return next(new ErrorHandler("UserId param not sent with request", 400))
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password -refreshToken",)
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "fullName username profilePhoto email ",

    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password",
                "-refreshToken"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
});

export const fetchChats = asyncHandler(async (req, res, next) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password -refreshToken")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "fullName profilePhoto email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
});

export const createGroupChat = asyncHandler(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return next(new ErrorHandler("Please Fill all the feilds", 400))
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return next(new ErrorHandler("More than 2 users are required to form a group chat", 400))
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password -refreshToken")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
});

export const renameGroup = asyncHandler(async (req, res, next) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password -refreshToken")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return next(new ErrorHandler("Chat not found", 404))
    } else {
        res.json(updatedChat);
    }
});

export const removeFromGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password -refreshToken")
        .populate("groupAdmin", "-password");

    if (!removed) {
        return next(new ErrorHandler("Chat not found", 404))
    } else {
        res.json(removed);
    }
});

export const addToGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        return next(new ErrorHandler("Chat not found", 404))
    } else {
        res.json(added);
    }
});