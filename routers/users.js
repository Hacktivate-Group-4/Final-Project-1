const router = require("express").Router();
const userController = require("../controllers/users");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/", userController.registerUser);

module.exports = router;
