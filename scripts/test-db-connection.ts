import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function testDbConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", connectionString ? "Set" : "Not set");
    
    const result = await sql`SELECT 1 as test`;
    console.log("✓ Database connection successful:", result);
    
  } catch (error) {
    console.error("✗ Database connection failed:", error);
  }
}

testDbConnection();
