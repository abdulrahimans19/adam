import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const authorizationHeader = req.header("Authorization");

  try {
    if (!authorizationHeader) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const [bearer, token] = authorizationHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}
