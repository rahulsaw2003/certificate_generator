import qr from "qr-image";
import fs from "fs";

const generateQRCode = (userData) => {
    // console.log(userData);
	try {
		const { name, url, userId } = userData;
		const firstName = name.split(" ")[0];
		const unique_filename = `${firstName}_${userId}`;

        //generate qr code
		var qr_png = qr.image(url, { type: "png" });

		//create file with png image of qr code

        if(!fs.existsSync('./QR_Codes')){
            fs.mkdir('./QR_Codes', (err) => {
                if(err) throw err;
                console.log("QR_Codes Directory Created")
            })
        }
		qr_png.pipe(fs.createWriteStream(`./QR_Codes/${unique_filename}.png`));

		console.log("QR Code created successfully");
	} catch (error) {
		console.log("An error occured while generating qrcode", error.message);
	}
};

export default generateQRCode;
