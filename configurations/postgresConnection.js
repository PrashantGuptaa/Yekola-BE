// import  * as pg from 'pg';
import { config } from 'dotenv';
// const { Client } = require('pg');
import pg from 'pg'
const { Pool } = pg
config();
async function getClient() {
    try {
        const pool = new Pool({
          host: process.env.PG_HOST,
          port: process.env.PG_PORT,
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD, 
          database: process.env.PG_DATABASE,
        //   ssl: true,
        });
        await pool.connect();
        console.log(`💥 Successfully Connected to Postgres Database`);
        return pool;        
    } catch (e) {
        console.error(e);
    }


}

const postgresClientConnection  = await getClient();




export default postgresClientConnection;

