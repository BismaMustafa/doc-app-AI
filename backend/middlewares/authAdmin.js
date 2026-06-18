import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    // Check if email and password match
    if (
      token_decode.email !== process.env.ADMIN_EMAIL ||
      token_decode.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    next(); // Proceed to next
  } catch (error) {
    console.log("Authentication error:", error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authAdmin;
