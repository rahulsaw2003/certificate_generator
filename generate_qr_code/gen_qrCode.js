import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

//step 1: getting user input and outputting it as a URL

inquirer
	.prompt([
		{
			message: "Please enter your url to generate qr-code:",
			name: "URL",
		},
	])
	.then((answers) => {
		//step 2: generating a QR code image for our URL
		// console.log(answers);
		const url = answers.URL;

		//generate qr code
		var qr_png = qr.image(url, { type: "png" });
		//create file with png image of qr code
		qr_png.pipe(fs.createWriteStream("qr_code.png"));

		//step 3: saving our user input
		fs.writeFile("URL.txt", url, (err) => {
			if (err) throw err;
			console.log("The file has been saved");
		});
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
