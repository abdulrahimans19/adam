import express from "express";
import { getProfile } from "../controllers/profile.js";
import authentication from "../middileware/auth.js";

const router = express.Router();

router.get("/", authentication, getProfile);
export default router;
 