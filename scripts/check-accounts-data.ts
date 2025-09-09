import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function checkAccountsData() {
  try {
    console.log("Checking accounts table data...");
    
    const accounts = await sql`SELECT * FROM accounts`;
    console.log("Accounts table data:");
    console.table(accounts);
    
    const users = await sql`SELECT id, name, email FROM users`;
    console.log("\nUsers table data:");
    console.table(users);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

checkAccountsData();
