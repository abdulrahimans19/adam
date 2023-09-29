import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  try {
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if(token.startsWith("Bearer")){
    token=token.slice(7,token.length).trimLeft()
  }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}
