import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("Environment variables check:");
console.log("BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "Set" : "Not set");
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL || "Not set");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set");
