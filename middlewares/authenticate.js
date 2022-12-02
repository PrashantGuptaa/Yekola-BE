import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    langoLogger.info(`Checking user authenticity`)
    if (!token) return res.status(401).json({ error: "Missing Token" });

    jwt.verify(token, process.env.AUTH_TOKEN, (err, user) => {
      if (err){
        console.error(err);
        return res
          .status(403)
          .json({ error: "Authentication token is no longer valid" });
          }
      req.user = user;
      next();
    });
  } catch (e) {
    langoLogger.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
