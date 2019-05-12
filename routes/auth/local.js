const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const { create } = require("../../controllers/localController");

router.route("/login")
    .post(passport.authenticate("local"), (req, res) => {
        res.send(req.user);
    })

router.route("/signup")
    .post(create);

router.route("/session")
    .get( (req, res) => req.user ? res.send(req.user) : res.send(false))

router.route("/logout")
    .post( (req, res) => {
        req.logout();
        res.redirect("/");
    })

module.exports = router;