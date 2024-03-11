import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: "participants_data",
		});
		console.log("MongoDB connected successfully!");
	} catch (error) {
		console.log("Error in MongoDb Connection", error.message);
	}
};

export default connectDB;
