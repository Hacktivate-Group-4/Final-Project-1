const createReflection = async (req, res) => {
  try {
    const db = req.app.get("db");
    const { success, low_point, take_away } = req.body;
    const userId = res.locals.user.id;

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
    res.status(500).json({ message: error.message });
  }
};

const getUserReflections = async (req, res) => {
  try {
    const db = req.app.get("db");
    const userId = res.locals.user.id;
    const query = {
      text: "SELECT * FROM Reflections WHERE UserId = $1",
      values: [userId],
    };

    const result = await db.query(query);

    if (result.rowCount === 0) {
      res.status(200).json({ message: "Belum menambahkan data" });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editReflection = async (req, res) => {
  try {
    const db = req.app.get("db");
    const userId = res.locals.user.id;
    const reflectionId = req.params.id;
    const { success, low_point, take_away } = req.body;

    const query = {
      text: "UPDATE Reflections SET success = $1, low_point = $2, take_away = $3 WHERE id = $4 AND UserId = $5 RETURNING *",
      values: [success, low_point, take_away, reflectionId, userId],
    };

    const result = await db.query(query);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Reflection not found or unauthorized" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getReflectionById = async (req, res) => {
  try {
    const db = req.app.get("db");
    const userId = res.locals.user.id;
    const reflectionId = req.params.id;
    const query = {
      text: "SELECT * FROM Reflections WHERE id = $1 AND UserId = $2",
      values: [reflectionId, userId],
    };

    const result = await db.query(query);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Reflection not found or unauthorized" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createReflection,
  getUserReflections,
  editReflection,
  getReflectionById,
};
