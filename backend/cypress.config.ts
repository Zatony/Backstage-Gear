import { defineConfig } from "cypress";
import mysql from "mysql2/promise";
import config from "./src/config/config";
import fs from "fs";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on) {
      on("task", {
        async resetDb() {
          try{
            const connection = await mysql.createConnection({
              host: "localhost",
              user: "user",
              password: "password",
              database: "backstagegear",
              port: 3306,
              multipleStatements: true
            });

            const sql = fs.readFileSync("cypress/db/seed.sql", "utf8");
            await connection.query(sql);
            await connection.end();

            return null;
          }
          catch(err){
            console.error("RESET DB ERROR:");
            console.error(err);
            throw err;
          }
        },
      })
    },
  },
});
