// import express from "express";
// import multer from "multer";
// import { protect } from "../middleware/auth.js";
// import { getUserData, updateUserData, discoverUser, follower, unfollowUser } from "../controllers/userController.js";

import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { getUserData, updateUserData, discoverUser, follower, unfollowUser, sendConnectionReques, acceptConnectionRequest, getConnectionRequest } from "../controllers/userController.js";
import User from "../models/user.js"; // ADD THIS LINE
import mongoose from "mongoose";
// import { registerUser } from "../controllers/userController.js";
const userRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

userRouter.get('/data',protect,getUserData);
// userRouter.post('/register',registerUser);
userRouter.post('/update', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), protect, updateUserData);
userRouter.post('/discover', protect, discoverUser);
userRouter.post('/follow', protect, follower);
userRouter.post('/unfollow', protect, unfollowUser);
userRouter.post('/connect', protect, sendConnectionRequest);
userRouter.post('/accept', protect, acceptConnectionRequest);
userRouter.get('/connection',protect,getConnectionRequest);
// In your userRouter.js - add this temporary route
userRouter.get('/check-db', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const userCount = await User.countDocuments();
        const allUsers = await User.find({});
        
        res.json({
            success: true,
            database: mongoose.connection.name,
            collections: collections.map(c => c.name),
            userCount: userCount,
            users: allUsers,
            message: userCount === 0 ? "Database is EMPTY" : "Data found"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
});
export default userRouter;