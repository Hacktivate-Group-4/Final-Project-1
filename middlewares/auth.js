const { verifyToken } = require("../helpers/jwt");
const db = require("pg");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"] || req.headers["Authorization"];

    if (!token) {
      throw {
        code: 401,
        message: "Token not provided!",
      };
    }

    const decoded = verifyToken(token);

    const query = {
      text: "SELECT id, email, username FROM Users WHERE id = $1 AND email = $2",
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
    res.status(error.code || 500).json(error.message);
  }
};

module.exports = {
  authentication,
};
