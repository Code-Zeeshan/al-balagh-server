module.exports = Object.freeze({
    PORT: Object.freeze({
        EXPRESS: process.env.EXPRESS_APP_PORT
    }),
    DB: Object.freeze({
        MONGO_URL: process.env.MONGO_URL
    }),
    TOKEN: Object.freeze({
        ACCESS: process.env.ACCESS_TOKEN_SECRET,
        REFRESH: process.env.REFRESH_TOKEN_SECRET,
    })
});