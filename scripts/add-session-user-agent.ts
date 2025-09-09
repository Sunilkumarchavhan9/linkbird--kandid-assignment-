import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addSessionUserAgent() {
  try {
    console.log("Adding user_agent column to sessions table...");
    
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT`;
    console.log(" Added user_agent column to sessions table");
    
    console.log("Sessions table fully fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addSessionUserAgent();
