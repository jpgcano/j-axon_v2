-- ============================================================
-- J-axon v2.0.0 - Down Migration (Rollback)
-- Drops all core tables, indexes, and enums
-- ============================================================

-- Drop tables (reverse dependency order)
DROP TABLE IF EXISTS "jaxon_audit_logs" CASCADE;
DROP TABLE IF EXISTS "jaxon_maintenance" CASCADE;
DROP TABLE IF EXISTS "jaxon_tickets" CASCADE;
DROP TABLE IF EXISTS "jaxon_assets" CASCADE;
DROP TABLE IF EXISTS "jaxon_users" CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "maintenance_status";
DROP TYPE IF EXISTS "maintenance_type";
DROP TYPE IF EXISTS "ticket_status";
DROP TYPE IF EXISTS "risk_level";
DROP TYPE IF EXISTS "asset_status";
DROP TYPE IF EXISTS "user_role";
