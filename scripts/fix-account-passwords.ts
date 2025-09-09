import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function fixAccountPasswords() {
  try {
    console.log("Fixing password hashes in accounts table...");
    
    // Get users with password hashes
    const users = await sql`SELECT id, email, password_hash FROM users WHERE password_hash IS NOT NULL`;
    
    for (const user of users) {
      // Update the corresponding account with the password hash
      await sql`
        UPDATE accounts 
        SET password = ${user.password_hash}
        WHERE user_id = ${user.id} AND provider_id = 'credential'
      `;
      console.log(`✓ Updated password for ${user.email}`);
    }
    
    console.log("Password hashes updated!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

fixAccountPasswords();
