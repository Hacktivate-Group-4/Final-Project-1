const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const token = req.headers["authorization"] || req.headers["Authorization"];

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Token not provided!",
      });
    }

    const decoded = verifyToken(token);

    const query = {
      text: "SELECT id, email FROM Users WHERE id = $1 AND email = $2",
      values: [decoded.id, decoded.email],
    };

    const result = await db.query(query);

    if (result.rows.length === 1) {
      const userData = result.rows[0];

      if (!res.locals.user) {
        res.locals.user = {};
      }

      res.locals.user = userData;

      return next();
    } else {
      throw {
        code: 401,
        message: "User not found",
      };
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  authentication,
};
