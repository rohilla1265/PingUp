import mongoose from "mongoose";
const connectDB  = async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("db connected"))
        await mongoose.connect(`${process.env.MONGODB_URL}/PingUp`)
    }
    catch{

    }
}
export default connectDB;