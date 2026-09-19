import fs from "fs";
import Post from "../models/Post.js";

import imagekit from "../config/imageKit.js"; 

export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth(); // Clerk authentication se userId lena
        const { content, post_type } = req.body;
        const images = req.files; // Multer middleware se aane wali files

        let image_urls = [];

       if (images && images.length > 0) {
    image_urls = await Promise.all(
        images.map(async (image) => {
            const buffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.originalname,
                folder: "posts"
            });
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1000' }
                ]
            });
            fs.unlinkSync(image.path); // Cleanup local temp file
            return url;
        })
    );
}

        const newPost = new Post({
            user: userId,
            content,
            image_urls,
            post_type
        });

        await newPost.save();

        res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get Posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);

        // User connections and followings
        const userIds = [userId, ...user.connections, ...user.following];
        const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({createdAt: -1});

        res.json({ success: true, posts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// Like Post / Toggle Like
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        const isLiked = post.likes_count.includes(userId);

        if (isLiked) {
            // Unlike: Remove user from likes_count array
            post.likes_count = post.likes_count.filter((id) => id !== userId);
        } else {
            // Like: Add user to likes_count array
            post.likes_count.push(userId);
        }

        await post.save();

        res.json({ success: true, message: isLiked ? "Post unliked" : "Post liked", post });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};