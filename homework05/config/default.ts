import "dotenv/config";
// used simple to call dotenv to import env vars from .env file into config
export const config = {
    app: {
        port: process.env.PORT || 3000,
        hostname: process.env.HOSTNAME || "localhost",
    },
    database: {
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/myDatabase",
    },
};