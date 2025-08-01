import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`mongodb connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`error connecting to db: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
