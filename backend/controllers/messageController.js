import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js"; 
import ErrorHandler from "../middleware/errorMiddleware.js";

export const allMessages = asyncHandler(async (req, res, next) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "fullName profilePhoto email username")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400))
    }
  });
  
  export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      return next (new ErrorHandler("Invalid data passed into request", 400))
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "fullName profilePhoto")
      message = await message.populate("chat")
      message = await User.populate(message, {
        path: "chat.users",
        select: "fullName profilePhoto email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      return next( new ErrorHandler(error.message), 400)
    }
  });

