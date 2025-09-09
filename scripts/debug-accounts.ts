import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function debugAccounts() {
  try {
    console.log("Debugging accounts table...");
    
    // Check specific user
    const user = await sql`
      SELECT id, email, password_hash 
      FROM users 
      WHERE email = 'chavhan753@gmail.com'
    `;
    console.log("User data:");
    console.table(user);
    
    // Check corresponding account
    const account = await sql`
      SELECT id, user_id, provider_id, account_id, password, created_at, updated_at
      FROM accounts 
      WHERE account_id = 'chavhan753@gmail.com' AND provider_id = 'credential'
    `;
    console.log("Account data:");
    console.table(account);
    
    // Check if password hash exists
    if (account.length > 0) {
      console.log("Password hash length:", account[0].password?.length || 0);
      console.log("Password hash preview:", account[0].password?.substring(0, 20) + "...");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

debugAccounts();
