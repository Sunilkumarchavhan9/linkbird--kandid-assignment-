import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function cleanAndTest() {
  try {
    console.log("Cleaning up and preparing for fresh signup...");
    await sql`DELETE FROM accounts WHERE account_id = 'test@example.com'`;
    await sql`DELETE FROM users WHERE email = 'test@example.com'`;
    console.log("Cleaned up test user");
    
    console.log("\nNow try signing up with a NEW email through the web interface:");
    console.log("- Go to http://localhost:3000/register");
    console.log("- Use a fresh email like: newuser@example.com");
    console.log("- Password: password123");
    console.log("- This should work with Better Auth's signup flow");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

cleanAndTest();
