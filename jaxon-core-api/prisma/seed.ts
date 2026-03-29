import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash, randomUUID } from "crypto";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

async function main() {
  console.log("[SEED] Seeding J-axon database...");

  const passwordHash = await bcrypt.hash("Admin@2024!", 12);
  const now = new Date();
  const systemIp = "127.0.0.1";
  const adminId = randomUUID();

  const integrityData = `${adminId}|admin@jaxon.local|${now.toISOString()}`;
  const integrityHash = sha256(integrityData);

  // Use raw SQL to insert the bootstrap admin user with self-referencing FKs
  // This avoids the chicken-and-egg problem with created_by/updated_by
  await prisma.$executeRawUnsafe(`
    INSERT INTO jaxon_users (id, email, password_hash, role_name, is_active, created_by, updated_by, created_at, updated_at, ip_origin, integrity_hash)
    VALUES ($1, $2, $3, $4, $5, $1, $1, $6, $6, $7, $8)
    ON CONFLICT (email) DO NOTHING
  `, adminId, "admin@jaxon.local", passwordHash, "ADMIN", true, now, systemIp, integrityHash);

  console.log(`[SEED] Admin user created: admin@jaxon.local (${adminId})`);
  console.log("[SEED] Seeding completed.");
}

main()
  .catch((e) => {
    console.error("[SEED] Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
