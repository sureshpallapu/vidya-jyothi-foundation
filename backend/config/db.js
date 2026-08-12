require("dotenv").config();

const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    connectTimeout: 10000,
});

(async () => {
    try {

        const connection = await db.getConnection();

        console.log("✅ MySQL Connected Successfully");

        connection.release();

    } catch (error) {

        console.error("❌ MySQL Connection Error");
        console.error("Code:", error.code);
        console.error("Message:", error.message);

    }
})();

module.exports = db;