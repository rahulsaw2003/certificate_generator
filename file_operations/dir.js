import fs from "fs";

// if (!fs.existsSync("./new_dir")) {
// 	fs.mkdir("./new_dir", (err) => {
// 		try {
// 			console.log("dir created!");
// 		} catch (error) {
// 			throw error;
// 		}
// 	});
// }

// if (fs.existsSync("./new_dir")) {
// 	fs.rmdir("./new_dir", (err) => {
// 		try {
// 			console.log("dir deleted!");
// 		} catch (error) {
// 			throw error;
// 		}
// 	});
// }

async function create_delete_dir() {
	if (!fs.existsSync("./new_dir")) {
		try {
			await fs.promises.mkdir("./new_dir");
			console.log("dir created");
		} catch (error) {
			console.error("Error creating directory", error);
		}
	}

	if (fs.existsSync("./new_dir")) {
		try {
			await fs.promises.rmdir("./new_dir");
			console.log("dir deleted");
		} catch (error) {
			console.error("Error deleting directory", error);
		}
	}
}

create_delete_dir();
