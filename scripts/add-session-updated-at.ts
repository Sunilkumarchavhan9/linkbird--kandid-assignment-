import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addSessionUpdatedAt() {
  try {
    console.log("Adding updated_at column to sessions table...");
    
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
    console.log("✓ Added updated_at column to sessions table");
    
    console.log("Sessions table fully fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addSessionUpdatedAt();
