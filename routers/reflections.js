const router = require("express").Router();
const reflectionsController = require("../controllers/reflections");
const { authentication } = require("../middlewares/auth");
const { authorization } = require("../middlewares/authorization");

router.post("/", authentication, reflectionsController.createReflection);

router.get("/", authentication, reflectionsController.getUserReflections);

// router.use("/:id", authorization);

module.exports = router;
