module.exports = {
    ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "5000",
    URL: process.env.URL || "http://localhost:5000",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://alex:alex123@ds145093.mlab.com:45093/restify_api",
    JWT_SECRET: process.env.JWT_SECRET || 'secret_jwt'
};