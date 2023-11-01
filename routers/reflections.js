const router = require("express").Router();
const reflectionsController = require("../controllers/reflections");
const { authentication } = require("../middlewares/auth");
const { authorization } = require("../middlewares/authorization");

// Endpoint yang tidak memerlukan otorisasi
router.post("/", authentication, reflectionsController.createReflection);
router.get("/", authentication, reflectionsController.getUserReflections);

// Endpoint yang memerlukan otorisasi
router.get("/:id", authentication, authorization, reflectionsController.getReflectionById);
router.put("/:id", authentication, authorization, reflectionsController.editReflection);
router.delete("/:id", authentication, authorization, reflectionsController.deleteReflectionById);

module.exports = router;
