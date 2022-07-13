import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

//VALIDATE USER ID
export const isValidUserID = (req, res, next) => {
  const id = req.query._id;
  if (!id) {
    res
      .status(400)
      .json({ success: false, message: "ID Field Cannot Be Empty" });
  } else if (!ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Pass A Valid ID" });
  } else {
    next();
  }
};

//AUTHENTICATE TOKEN
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "No Token Received" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userLogin) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid Token Or No Longer Valid" });
    req.userLogin = userLogin;
    next();
  });
};
