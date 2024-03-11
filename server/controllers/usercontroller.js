import generateQRCode from "../utils/generate_qr.js";
import User from "../mongoDB/model.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import generateCertificate from "../utils/generateCertificate.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

import  fs  from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getUserData = async (req, res) => {
	const { name, email, college_name } = req.body;
	const uniqueId = uuidv4();
	try {
		if (!name || !email || !college_name) {
			return res.status(422).json({ message: "Please fill all the fields" });
		}

		const uniqueUrl = `${process.env.BASE_URL}/view/${uniqueId}`;
		// console.log("URL: ", uniqueUrl)

		const newParticipant = await User.create({ name, email, college_name, uniqueId });
		await newParticipant.save();

		generateQRCode({ name, url: uniqueUrl, userId: newParticipant._id });

		console.log("User create successfully and saved in the DB");

		res.status(201).json({ message: "New participant created successfully", User: newParticipant });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Something went wrong while creating participant", error });
	}
};

export const viewUser = async (req, res) => {
	const { uniqueId } = req.params;

	// const url = `${process.env.BASE_URL}/view/${uniqueId}`;

	try {
		const user = await User.findOne({ uniqueId });

		if (!user) {
			return res.send("No such user exit in database!");
		}

		const qrCodeFileName = `${user.name.split(" ")[0]}_${user._id}.png`;

		const currentDir = path.dirname(new URL(import.meta.url).pathname);

		const qrCodeImagePath = path.join(currentDir, "../QR_Codes", qrCodeFileName);
		console.log(qrCodeImagePath);

		res.send(`
            <h1>User Data</h1>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>College:</strong> ${user.college_name}</p>
            <p><strong>Created At:</strong> ${user.createdAt}</p>
            <!-- <img src="${qrCodeImagePath}" alt="QR Code"> -->
        `);
	} catch (error) {
		console.log("Something went wrong while showing userData: ", error.message);
		res.status(500).send("Internal Server Error");
	}
};

export const getCertificate = async (req, res) => {
	const { uniqueId } = req.params;

	try {
		const user = await User.findOne({ uniqueId });

		if (!user) {
			return res.status(404).json({ message: "No such user exists in the database!" });
		}

		const url = `${process.env.BASE_URL}/view/${user.uniqueId}`;

		// Generate certificate and obtain the PDF path
		const pdf_filename = await generateCertificate({
			userData: {
				name: user.name,
				email: user.email,
				college_name: user.college_name,
				createdAt: user.createdAt,
				userId: user._id,
				uniqueUrl: url,
			},
		});
		
		const pdfPath = path.join(path.dirname(__dirname), pdf_filename);

		res.download(pdfPath, `${user.name.split(" ")[0]}_certificate.pdf`, (err) => {
			if (err) {
				console.error("Certificate Download error:", err);
				res.status(500).json({ error: "Error occurred while downloading file", err });
			} else {
				console.log("Certificate Download successful.");

				fs.unlink(pdf_filename, (unlinkErr) => {
					if (unlinkErr) {
						console.error("Error deleting certificate file:", unlinkErr);
					} else {
						console.log("Certificate file deleted successfully.");
					}
				});
			}
		});

		// fs.unlink(pdf_filename);
	} catch (error) {
		console.error("Error fetching user data or generating certificate:", error);
		res.status(500).send("Internal Server Error");
	}
};
