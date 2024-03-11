import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

export default async function generateCertificate({ userData }) {
	try {
		const { name, email, college_name, createdAt, userId, uniqueUrl } = userData;
		const qrCodeFilename = `${name.split(" ")[0]}_${userId}.png`;

		// Function to generate PDF with embedded QR code image
		async function generatePDFWithQRCodeImage(qrCodeData) {
			// Create a new PDF document
			try {
				const pdfDoc = await PDFDocument.create();

				// Add a new page
				const page = pdfDoc.addPage([600, 800]); // Set page size to fit A4 paper

				page.setFontSize(32);
				page.setFontColor(rgb(0, 0, 0.45)); // Black color

				// Draw the title (certificate) in bold
				page.drawText("Certificate", { x: 200, y: 700 });

				// Draw decorative border
				page.drawRectangle({
					x: 25,
					y: 25,
					width: 550,
					height: 750,
					borderColor: rgb(0.8, 0.2, 0.2),
					borderWidth: 2,
				});

				// Draw user data
				const userDataText = `Name: ${name}\nEmail: ${email}\nCollege: ${college_name}\nCreated At: ${createdAt.toString()}\nUnique Url: ${uniqueUrl}`;
				page.setFontSize(15);
				page.setFontColor(rgb(0, 0.43, 0.71));
				page.drawText(userDataText, { x: 50, y: 650, lineHeight: 20, maxWidth: 500 }); 

				// Embed QR code image
				const qrCodeImage = await pdfDoc.embedPng(qrCodeData);
				page.drawImage(qrCodeImage, { x: 400, y: 50, width: 150, height: 150 });

				// Save the PDF document
				return await pdfDoc.save();
			} catch (error) {
				console.log(error);
			}
		}

		// Function to read QR code image file
		function readQRCodeImage(filename, callback) {
			const filePath = `./QR_Codes/${filename}`;

			// Read the file
			fs.readFile(filePath, (err, data) => {
				if (err) {
					callback(err, null);
				} else {
					callback(null, data);
				}
			});
		}

		return new Promise((resolve, reject) => {
			// Read the QR code image
			readQRCodeImage(qrCodeFilename, async (err, qrCodeData) => {
				if (err) {
					console.error("Error reading QR code image:", err);
					reject(err);
					return; // Exit function on error
				}

				// Generate PDF with embedded QR code image
				const pdfBytes = await generatePDFWithQRCodeImage(qrCodeData);

				const pdfFilename = `./Certificates/${name.split(" ")[0]}_cert_${userId}.pdf`;

				if (!fs.existsSync("./Certificates")) {
					fs.mkdirSync("./Certificates");
				}

				// Write the PDF content to a new file
				fs.writeFile(pdfFilename, pdfBytes, (err) => {
					if (err) {
						console.error("Error writing PDF file:", err);
						reject(err);
						return; // Exit function on error
					}

					// Delete the QR code file
					fs.unlink(`./QR_Codes/${qrCodeFilename}`, (err) => {
						if (err) {
							console.error("Error deleting QR code file:", err);
							// Don't reject here, continue resolving with PDF filename
						} else {
							console.log("QR Code file deleted successfully.");
						}
					});

					resolve(pdfFilename);
				});

			});
		});
	} catch (error) {
		console.error("An error occurred while generating the certificate:", error);
		throw error; // Rethrow the error
	}
}
