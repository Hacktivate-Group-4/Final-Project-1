const router = require("express").Router();
const reflectionsRouter = require("./reflections");
const usersRouter = require("./users");

router.use("/users", usersRouter);

router.use("/reflections", reflectionsRouter);

module.exports = router;
