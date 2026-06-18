import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.docId = token_decode.id;

    next(); // Proceed to next
  } catch (error) {
    console.log("Authentication error:", error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authDoctor;
