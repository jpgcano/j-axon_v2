import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seeder para Roles y Usuarios Iniciales
 * Establece los perfiles requeridos para la validación de RBAC.
 */
export async function seedUsers() {
  console.log('[Seeder] Generando roles y usuarios de prueba...');
  
  const saltRounds = 12;
  const defaultPassword = await bcrypt.hash('Jaxon2024!', saltRounds);

  const users = [
    { email: 'admin@jaxon.local', role: 'ADMIN', name: 'System Administrator' },
    { email: 'manager@jaxon.local', role: 'MANAGER', name: 'Risk Manager' },
    { email: 'tech@jaxon.local', role: 'TECH', name: 'Maintenance Technician' },
    { email: 'auditor@jaxon.local', role: 'AUDITOR', name: 'External Auditor' },
    { email: 'cro@jaxon.local', role: 'MANAGER', name: 'Chief Risk Officer' } 
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: defaultPassword,
        name: user.name,
        role: user.role,
      }
    });
  }

  console.log('[SUCCESS] Usuarios de prueba creados correctamente.');
}

seedUsers()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });