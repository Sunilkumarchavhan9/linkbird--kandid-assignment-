import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function createTestUser() {
  try {
    console.log("Creating test user with proper password...");
    
    const email = "test@example.com";
    const password = "password123";
    const name = "Test User";
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hash created:", passwordHash.substring(0, 20) + "...");
    
    // Create user
    const userId = `user_${Date.now()}`;
    await sql`
      INSERT INTO users (id, name, email, email_verified, password_hash, created_at, updated_at)
      VALUES (${userId}, ${name}, ${email}, true, ${passwordHash}, NOW(), NOW())
    `;
    console.log("✓ User created");
    
    // Create credential account
    await sql`
      INSERT INTO accounts (
        id, user_id, provider_id, account_id, password, 
        created_at, updated_at
      ) VALUES (
        ${`cred_${userId}`}, 
        ${userId}, 
        'credential', 
        ${email}, 
        ${passwordHash}, 
        NOW(), 
        NOW()
      )
    `;
    console.log("✓ Credential account created");
    
    console.log("\nTest credentials:");
    console.log("Email:", email);
    console.log("Password:", password);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

createTestUser();
