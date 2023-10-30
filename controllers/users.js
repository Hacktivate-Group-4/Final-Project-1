const bcrypt = require("../helpers/bcrypt");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  try {
    const db = req.app.get("db");
    const query = {
      text: "SELECT r.id, r.success, r.low_point, r.take_away, r.UserId, r.createdAt, r.updatedAt FROM Reflections r WHERE r.UserId = $1",
      values: [req.user.id],
    };

    const result = await db.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

const registerUser = async (req, res) => {
  try {
    const db = req.app.get("db");
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hashPassword(password);

    const query = {
      text: "INSERT INTO Users(email, password) VALUES($1, $2) RETURNING id, email",
      values: [email, hashedPassword],
    };

    try {
      const result = await db.query(query);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(400).json({ message: "Email already used!" });
    }
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const db = req.app.get("db");
    const { email, password } = req.body;

    const query = {
      text: "SELECT id, email, password FROM Users WHERE email = $1",
      values: [email],
    };

    const result = await db.query(query);

    if (result.rows.length === 1) {
      const userData = result.rows[0];
      const isCorrect = comparePassword(password, userData.password);

      if (!isCorrect) {
        throw {
          code: 401,
          message: "Email or password invalid!",
        };
      }

      const token = generateToken({
        id: userData.id,
        email: userData.email,
      });

      res.status(200).json({
        token,
      });
    } else {
      throw {
        code: 401,
        message: "Email or password invalid!",
      };
    }
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};
