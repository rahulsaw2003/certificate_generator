import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import connectDB from "./mongoDB/connection.js";
import router from "./routes/route.js";
import cors from 'cors';
import path from 'path';

const port = process.env.PORT || 4000;
config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connectDB();

app.use("/api", router);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
