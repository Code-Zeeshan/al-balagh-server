const mongoose = require('mongoose');
const CONFIG = require("./index");

module.exports = () => {
    try {
        mongoose.connect(
            CONFIG.DB.MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                if (err) throw err;
                console.log("Mongodb connection established");
            }
        );
    } catch (err) {
        console.error(err);
    }
}