import React, { useState } from "react";
import "./mix.css";
import { toast } from "react-toastify";
import { getCertificate, submitDetails } from "./api";
import FileSaver from 'file-saver';

const defaultUserDetails = {
	name: "",
	email: "",
	college_name: "",
};

const Home = () => {
	const [userData, setUserData] = useState(defaultUserDetails);

	const handleValueChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleClick = async (e) => {
		e.preventDefault();
		const { name, email, college_name } = userData;

		if (!name || !email || !college_name) {
			return toast.warn("Please fill all the fields");
		}
		if (!email.includes("@")) {
			return toast.warn("Please enter a valid email");
		}

		try {
			const res = await submitDetails(userData);
			if (res?.status === 201) {
				toast.success("User registered & QR code created Successfully!");
				const resp = await getCertificate(res.data.User.uniqueId);
				if (resp?.status === 200) {
					toast.success("Certificate Generated successfully and it will be downloaded soon!");
					const pdfBlob = new Blob([resp.data], { type: "application/pdf" });
					
					FileSaver.saveAs(pdfBlob, `${userData.name.split(" ")[0]}_Certficate.pdf`)
				}
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred. Please try again later.");
		}

		setUserData(defaultUserDetails);
	};


	return (
		<section>
			<div className="form_data">
				<div className="form_heading">
					<h1>Certificate Generate/Download</h1>
				</div>

				<form method="post">
					<div className="form_input">
						<label htmlFor="name">Name</label>
						<input type="name" name="name" id="name" placeholder="Enter your full name" onChange={(e) => handleValueChange(e)} value={userData.name} required/>
					</div>
					<div className="form_input">
						<label htmlFor="email">Email</label>
						<input type="email" name="email" id="email" placeholder="Enter your email address" onChange={(e) => handleValueChange(e)} value={userData.email} required/>
					</div>
					<div className="form_input">
						<label htmlFor="college_name">College/University name</label>
						<input type="name" name="college_name" id="college_name" placeholder="Enter your college name" onChange={(e) => handleValueChange(e)} value={userData.college_name} required/>
					</div>

					<button className="btn" onClick={(e) => handleClick(e)}>
						Get Certificate
					</button>
				</form>
			</div>
		</section>
	);
};

export default Home;
