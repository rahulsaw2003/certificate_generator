import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name!"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please enter your email!"],
			trim: true,
		},
		college_name: {
			type: String,
		},
		uniqueId: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);


const User = mongoose.model("Participant", userSchema);

export default User;
