const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const passport = require("./config/passport");
const authRoutes = require("./routes/auth/");

const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");

const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"]
};

app.use(cors(corsOption));

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Creating Sessions
app.use(session({ secret: "By Grabthar's Hammer... What a savings...", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Static assets for production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Define Auth routes here
app.use("/api", authRoutes);

// Send every other requests to React app
// Define API routes before this
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Connect to the Mongo DB
mongoose.connect(process.env.MONGOD_URI || "mongodb://localhost/test-oauth");

// Server listens on specified port
app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
});