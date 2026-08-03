import { Client, Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool =  new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const db = pool;
export const connectToSql = async ()=>{
    try{
        await pool.connect().then(()=>{
            console.log("PostgreSQL connected successfully");
        });
    }catch(err){
        console.error("Database connection failed:", err);
    }
        
};

export function getDB(){
    return db;
}


