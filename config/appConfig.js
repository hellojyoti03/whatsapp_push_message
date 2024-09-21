//@ts-nocheck

const dbConfig = require("./dbConfig.json")[process.env.NODE_ENV];

const appConfig = {};

appConfig.allowedCorsOrigin = "*";
appConfig.MONGO_PORT = dbConfig.port;
appConfig.apiVersion = "/api/v1";

appConfig.db = {
	uri: `mongodb+srv://${dbConfig.username}:${dbConfig.password}@cluster0.zmo6ugy.mongodb.net/${dbConfig.database}?retryWrites=true&w=majority`,
};

appConfig.baseUri = `http://localhost:6050/api/v1`;
module.exports = appConfig;
