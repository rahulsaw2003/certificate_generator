import express from 'express';
import { getCertificate, getUserData, viewUser } from '../controllers/usercontroller.js';

const router = express.Router();

router.get("/", (req, res) =>{
    res.status(200).json({message: "Server is running on secure connection"});
})

router.post("/submit", getUserData);

router.get("/view/:uniqueId", viewUser);

router.get("/get_cert/:uniqueId", getCertificate);

export default router;