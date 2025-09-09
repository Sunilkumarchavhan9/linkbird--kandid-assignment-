import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function createCredentialAccounts() {
  try {
    console.log("Creating credential accounts for existing users...");
    
    // Get all users
    const users = await sql`SELECT id, email, password_hash FROM users`;
    
    for (const user of users) {
      // Check if account already exists
      const existingAccount = await sql`
        SELECT id FROM accounts 
        WHERE user_id = ${user.id} AND provider_id = 'credential'
      `;
      
      if (existingAccount.length === 0) {
        // Create credential account
        await sql`
          INSERT INTO accounts (
            id, user_id, provider_id, account_id, password, 
            created_at, updated_at
          ) VALUES (
            ${`cred_${user.id}`}, 
            ${user.id}, 
            'credential', 
            ${user.email}, 
            ${user.password_hash || ''}, 
            NOW(), 
            NOW()
          )
        `;
        console.log(`✓ Created credential account for ${user.email}`);
      } else {
        console.log(`- Account already exists for ${user.email}`);
      }
    }
    
    console.log("Credential accounts created!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

createCredentialAccounts();
