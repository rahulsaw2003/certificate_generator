import { promises as fs } from "fs";

const fileOps = async () => {
	try {
		const data = await fs.readFile("./text_files/starter.txt", "utf8");
		console.log(data);

		await fs.unlink("./text_files/starter.txt");
		console.log("starter.txt file deleted!");

		await fs.writeFile("./text_files/async_write.txt", `\n${data}, but modified.`);
		await fs.appendFile("./text_files/async_write.txt", "\n\nNice to meet you!");
		await fs.rename("./text_files/async_write.txt", "./text_files/new_reply.txt");

		const newData = await fs.readFile("./text_files/new_reply.txt", "utf8");
		console.log(newData);
	} catch (err) {
		console.error(err);
	}
};

fileOps();
