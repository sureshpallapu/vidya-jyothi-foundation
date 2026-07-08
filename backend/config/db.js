const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Suresh@63",
  database: "vidya_jyothi_foundation",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/*
|--------------------------------------------------------------------------
| Test Database Connection
|--------------------------------------------------------------------------
*/

(async () => {
  try {
    const connection = await db.getConnection();

    console.log("✅ MySQL Connected");

    connection.release();

  } catch (error) {

    console.error("❌ MySQL Connection Error:", error);

  }
})();

module.exports = db;