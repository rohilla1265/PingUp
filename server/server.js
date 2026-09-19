import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express';
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Connect database
connectDB();

// Routes
app.get('/', (req, res) => res.send("server started"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);

// Local ke liye listen rakho, Vercel ke liye app export karo
const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`server is listening at port ${port}`));
}

export default app;
// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import connectDB from "./config/db.js";
// import { inngest, functions } from "./inngest/index.js";
// import { serve } from "inngest/express"; // ✅ serve function import किया
// import { clerkMiddleware } from '@clerk/express'
// import userRouter from "./routes/userRoutes.js";
// import postRouter from "./routes/postRouter.js";
// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(clerkMiddleware())
// // Initialize server
// const startServer = async () => {
//     try {
//         await connectDB();
//         
//         app.get('/', (req, res) => res.send("server started"));
//         app.use("/api/inngest", serve({ client: inngest, functions }));
//         app.use('/api/user',userRouter)
//         app.use('/api/post',postRouter);
//         const port = process.env.PORT || 4000;
//         app.listen(port, () => console.log(`server is listening at port ${port}`));
//         
//     } catch (error) {
//         console.error("Failed to start server:", error);
//         process.exit(1);
//     }
// };

// startServer();