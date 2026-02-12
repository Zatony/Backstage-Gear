import mysql from "mysql2/promise";
import config from "../config/config";

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure connection sessions use the DB collation to avoid mixed-collation errors
// (tables use utf8mb4_hungarian_ci in init.sql)
(pool as any).on?.('connection', (connection: any) => {
  // Set character set and collation for each new connection
  connection.promise().query("SET NAMES utf8mb4 COLLATE 'utf8mb4_hungarian_ci'").catch(() => {});
  connection.promise().query("SET collation_connection = 'utf8mb4_hungarian_ci'").catch(() => {});
});

export default pool;