const router = require("express").Router();
const local = require("./local");
const twitter = require("./twitter");

router.use("/auth", local);
router.use("/auth/twitter", twitter);

module.exports = router;