import User from "../models/user.js"
import fs from 'fs'
import mongoose, { connection } from "mongoose";
import imagekit from "../config/imageKit.js";
import Connection from "../models/connection.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = await req.auth(); // This is Clerk user ID
        
        // ✅ FIX: Find by clerkUserId instead of _id
        const user = await User.findOne({ clerkUserId: userId });
        
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found in database",
                debug: {
                    clerkUserId: userId,
                    suggestion: "Make sure user exists with this clerkUserId"
                }
            });
        }
        
        res.json({ success: true, user });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export const updateUserData = async (req, res) => {
    try {
        const auth = await req.auth();
        const userId = auth.userId;
        const user = await User.findOne({ clerkUserId: userId });
        
        if (!user) {
            return res.json({ success: false, message: "User not found in database" });
        }

        const { username, bio, location, full_name } = req.body;
        
        let newUsername = username;
        if (!newUsername) {
            newUsername = user.username;
        }
        
        if (newUsername !== user.username) {
            const existingUser = await User.findOne({ 
                username: newUsername,
                _id: { $ne: user._id } 
            });
            if (existingUser) {
                newUsername = user.username;
            }
        }

        const updatedData = {
            username: newUsername,
            location,
            bio,
            full_name
        }
        
        const profile = req.files?.profile && req.files.profile[0];
        const cover = req.files?.cover && req.files.cover[0];
        
        if(profile){
            const buffer = fs.readFileSync(profile.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            })
            updatedData.profile_picture = url;
        }
        
        if(cover){
            const buffer = fs.readFileSync(cover.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
            updatedData.cover_photo = url;
        }
        
        // ✅ FIX: Update using the user's MongoDB _id
        const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true });
        
        res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}
export const discoverUser = async (req, res) => {
    try {
        const auth = await req.auth(); // Get the auth object
        const userId = auth.userId; // Extract userId from auth object
        const { input } = req.body;
        
        const allUser = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') }
            ]
        });
        const filteredUser = allUser.filter(user=>user.id!== userId);
        res.json({ success: true, users: allUser });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export const follower=async(req,res)=>{
    try {
        const auth = await req.auth(); // Get the auth object
        const userId = auth.userId; // Extract userId from auth object
        const {id} = req.body;
        const user = await User.findById(userId); // Added await
        if(user.following.includes(id)){
            return res.json({success:false,message:"You Already follow this user"});
        }
        user.following.push(id);
        await user.save()
        const toUser = await User.findById(id)
        toUser.followers.push(userId);
        await toUser.save();
        res.json({success:true,message:"you are following now"});
    }
    catch(error){
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export const unfollowUser=async(req,res)=>{
    try {
        const auth = await req.auth(); // Get the auth object
        const userId = auth.userId; // Extract userId from auth object
        const {id} = req.body;
        const user = await User.findById(userId); // Added await
        if(!user.following.includes(id)){
            return res.json({success:false,message:"You are not following this user"});
        }
        user.following = user.following.filter(followId => followId.toString() !== id);
        await user.save()
        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(followerId => followerId.toString() !== userId);
        await toUser.save();
        res.json({success:true,message:"you have unfollowed this user"});
    }
    catch(error){
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { Id } = req.body
        const last24hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        // Fix: use 'Connection' instead of 'connection'
        const connectionRequests = await Connection.find({
            from_user_id: userId,
            created_at: { $gt: last24hours } // Keeping your field name
        })
        
        if (connectionRequests.length >= 20) {
            return res.json({
                success: false,
                message: "you have sent more than 20 requests"
            })
        }

        // Fix: use different variable name to avoid conflict
        const existingConnection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: Id },
                { from_user_id: Id, to_user_id: userId },
            ]
        })

        if (!existingConnection) {
            // Fix: corrected the ID order - you should be the sender
            await Connection.create({
                from_user_id: userId,  // You are sending
                to_user_id: Id         // They are receiving
            })
            return res.json({
                success: true, 
                message: "connection sent successsfully"
            })
        }
        else if (existingConnection && existingConnection.status === "accepted") {
            return res.json({
                success: false, 
                message: "you are already connected"
            })
        }
        
        // If connection exists but is pending
        return res.json({
            success: true, 
            message: "connection sent successsfully"
        })
    }
    catch (err) {
        // Added error handling
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
export const getConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        
        // Find all pending requests sent TO the current user
        const connectionRequests = await Connection.find({
            to_user_id: userId,
            status: 'pending'
        }).populate('from_user_id', 'name email profile_pic') // Populate sender details
        
        return res.json({
            success: true,
            message: "connection requests fetched successfully",
            data: connectionRequests
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { Id } = req.body // This is the sender's user ID
        
        if (!Id) {
            return res.status(400).json({
                success: false,
                message: "user ID is required"
            })
        }

        // Find the pending connection request
        const connectionRequest = await Connection.findOne({
            from_user_id: Id,
            to_user_id: userId,
            status: 'pending'
        })

        if (!connectionRequest) {
            return res.json({
                success: false,
                message: "no pending connection request found from this user"
            })
        }

        // Update status to accepted
        connectionRequest.status = 'accepted'
        await connectionRequest.save()

        return res.json({
            success: true,
            message: "connection request accepted successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}