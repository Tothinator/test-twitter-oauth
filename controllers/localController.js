const { User } = require("../models");

module.exports = {
    create: function(req, res){
        User.create({
            username: req.body.username,
            password: req.body.password,
        }).then(dbUser => {
            res.redirect(307, "/api/auth/login");
        }).catch(err => res.json(err));
    },
    findUser: function(req, res){
        User.findOne({ username: req.body.username }, "-password")
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(422).json(err));
    }
}