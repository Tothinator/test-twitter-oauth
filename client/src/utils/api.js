const axios = require("axios");

export default {
    
    login: function(user) {
        return axios.post("/api/auth/login", user);
    },

    signUp: function(user) {
        return axios.post("/api/auth/signUp", user);
    },

    getSession: function() {
        return axios.get("/api/auth/session");
    },

    logout: function() {
        return axios.post("/api/auth/logout")
    }
}