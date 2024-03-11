import axios from "axios";

// const serverURL = "http://localhost:5000";

const serverURL = "https://certificate-generator-server.onrender.com";

export const submitDetails = async (userData) => {
	try {
		const res = await axios.post(`${serverURL}/api/submit`, userData);
		console.log("User details at API: ", res);
		return res;
	} catch (error) {
		console.log("Error in /api/submit: ", error);
	}
};

export const getCertificate = async (uniqueId) => {
	try {
		const res = await axios.get(`${serverURL}/api/get_cert/${uniqueId}`, { responseType: "blob" });
		console.log("Certificate details fetched at API", res);
		return res;
	} catch (error) {
		console.log("Error in creating certificate ", error);
	}
};
