-- ============================================================
-- J-axon v2.0.0 - Seed: Bootstrap Admin User
-- Compatible with: PostgreSQL 15+ / Supabase
-- ============================================================
-- NOTE: Replace the password_hash with a fresh Argon2id/bcrypt hash
-- before executing in production.
-- Default password: Admin@2024! (bcrypt, 12 rounds)
-- ============================================================

DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
  pwd_hash VARCHAR(255) := '$2b$12$placeholder_replace_with_real_hash';
  now_ts TIMESTAMPTZ := CURRENT_TIMESTAMP;
  sys_ip INET := '127.0.0.1'::INET;
  i_hash CHAR(64) := encode(sha256(convert_to(admin_id::text || '|admin@jaxon.local|' || now_ts::text, 'UTF8')), 'hex');
BEGIN
  INSERT INTO jaxon_users (id, email, password_hash, role_name, is_active, created_by, updated_by, created_at, updated_at, ip_origin, integrity_hash)
  VALUES (admin_id, 'admin@jaxon.local', pwd_hash, 'ADMIN', true, admin_id, admin_id, now_ts, now_ts, sys_ip, i_hash)
  ON CONFLICT (email) DO NOTHING;

  RAISE NOTICE '[SEED] Admin user created: admin@jaxon.local (%)' , admin_id;
END $$;
