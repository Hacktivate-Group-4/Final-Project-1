function authorization(req, res, next) {
  const db = req.app.get("db");
  const reqId = req.params.id;
  const authenticatedUser = res.locals.user;

  if (!authenticatedUser) {
    return res.status(401).json({
      name: "Unauthorized",
      devMessage: "User not authenticated",
    });
  }

  const query = {
    text: "SELECT * FROM Reflections WHERE id = $1",
    values: [reqId],
  };

  db.query(query)
    .then((result) => {
      const foundReflection = result.rows[0];

      if (!foundReflection) {
        return res.status(404).json({
          name: "Data not found",
          devMessage: `Reflection with id ${reqId} not found`,
        });
      }

      if (foundReflection.userid === authenticatedUser.id) {
        return next();
      } else {
        return res.status(403).json({
          name: "Authorization failed",
          devMessage: `User with id ${foundReflection.userid} does not have permission to access the reflection`,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
}

module.exports = { authorization };
