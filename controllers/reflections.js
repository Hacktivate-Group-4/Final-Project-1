const createReflection = async (req, res) => {
  try {
    const db = req.app.get("db");
    const { success, low_point, take_away } = req.body;
    const userId = req.user.id;

    const query = {
      text: "INSERT INTO Reflections (success, low_point, take_away, UserId) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [success, low_point, take_away, userId],
    };

    const result = await db.query(query);

    if (result.rows.length === 1) {
      const reflection = result.rows[0];
      res.status(201).json(reflection);
    } else {
      res.status(500).json({ message: "Failed to create reflection" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserReflections = async (req, res) => {
  try {
    const db = req.app.get("db");
    const userId = req.user.id;
    const query = {
      text: "SELECT * FROM Reflections WHERE UserId = $1",
      values: [userId],
    };

    const result = await db.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createReflection,
  getUserReflections,
};
