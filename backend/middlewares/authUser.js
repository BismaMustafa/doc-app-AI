import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = token_decode.id;

    next(); // Proceed to next
  } catch (error) {
    console.log("Authentication error:", error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
