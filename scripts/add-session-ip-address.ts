import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addSessionIpAddress() {
  try {
    console.log("Adding ip_address column to sessions table...");
    
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address TEXT`;
    console.log("✓ Added ip_address column to sessions table");
    
    console.log("Sessions table fully fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addSessionIpAddress();
