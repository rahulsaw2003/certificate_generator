import fs from "fs";

const rs = fs.createReadStream("./text_files/lorem.txt", { encoding: "utf8" });

const ws = fs.createWriteStream("./text_files/new_lorem.txt");

// rs.on("data", (dataChunk) => {
// 	ws.write(dataChunk);
// });

rs.pipe(ws)