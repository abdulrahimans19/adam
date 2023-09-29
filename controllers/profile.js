import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from 'fs'

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId=req.user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ msg: "New password and confirm password do not match" });
    }
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Current password is incorrect" });
    }
    if(req.file){
      if(user.profilePicture){
        const oldProfilePicture=`public/assets/${user.profilePicture}`;
        fs.unlinkSync(oldProfilePicture)
      }
      user.profilePicture=req.file.filename
    }
    if (newPassword) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({ msg: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
