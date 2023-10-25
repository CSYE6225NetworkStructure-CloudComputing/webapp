module.exports = {
    HOST: DB_HOST || "127.0.0.1",
    USER: DB_USER || "root",
    PASSWORD: DB_PASSWORD || "root",
    DB: DB_NAME || "webapp",
    dialect: DB_DIALECT || "mysql",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};