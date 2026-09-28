import pool from "./lib/db.js";
import "dotenv/config";

const result = await pool.query('SELECT NOW()')
console.log(result.rows)
