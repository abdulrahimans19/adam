import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import connection from "./db.js";
import userRoute from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import { updateProfile } from "./controllers/profile.js";
import { register } from "./controllers/auth.js";
import { fileURLToPath } from "url";
import authentication from './middileware/auth.js'

dotenv.config();
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/auth/register", upload.single("profilePicture"), register);
app.put("/profile",authentication, upload.single("profilePicture"), updateProfile);

app.use("/auth", userRoute);
app.use("/profile", profileRoute);

app.listen(port, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
});
