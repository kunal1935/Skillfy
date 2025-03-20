import mongoose from "mongoose";

const connectDB =async()=>{
    mongoose.connection.on('connected',()=>console.log('Database Connected'))
    await mongoose.connecyt(`${process.env.MONGODB_UR} /lms`)
}

export default connectDB;