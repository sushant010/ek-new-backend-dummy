const express = require("express");
const router = express.Router();

const SpeServControllers = require("../controller/specialService");

router.post("/signup", SpeServControllers.signup);

router.post("/login", SpeServControllers.login);

router.get("/getUser/:email", SpeServControllers.getUser);

router.post("/publishCourse/:email", SpeServControllers.publishCourse);

module.exports = router;
