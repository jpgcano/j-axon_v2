-- ============================================================
-- J-axon v2.0.0 - Core Schema Migration
-- Compatible with: PostgreSQL 15+ / Supabase
-- Source: Prisma migration 20260329043956_init_core_schema
-- ============================================================

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

CREATE TYPE "user_role" AS ENUM ('ADMIN', 'MANAGER', 'TECH', 'AUDITOR');
CREATE TYPE "asset_status" AS ENUM ('ACTIVE', 'MAINTENANCE', 'RETIRED');
CREATE TYPE "risk_level" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'EXTREME');
CREATE TYPE "ticket_status" AS ENUM ('OPEN', 'PENDING_APPROVAL', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE "maintenance_type" AS ENUM ('PREVENTIVE', 'CORRECTIVE');
CREATE TYPE "maintenance_status" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

-- 1. Users (RBAC identities)
CREATE TABLE "jaxon_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_name" "user_role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origin" INET NOT NULL,
    "integrity_hash" CHAR(64) NOT NULL,
    CONSTRAINT "jaxon_users_pkey" PRIMARY KEY ("id")
);

-- 2. Assets (physical/logical inventory)
CREATE TABLE "jaxon_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "status" "asset_status" NOT NULL,
    "assigned_to" UUID,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origin" INET NOT NULL,
    "integrity_hash" CHAR(64) NOT NULL,
    CONSTRAINT "jaxon_assets_pkey" PRIMARY KEY ("id")
);

-- 3. Tickets (incidents with risk triage)
CREATE TABLE "jaxon_tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "asset_id" UUID NOT NULL,
    "issue_description" TEXT NOT NULL,
    "inherent_risk_level" "risk_level" NOT NULL,
    "status" "ticket_status" NOT NULL,
    "assigned_tech_id" UUID,
    "approved_by_id" UUID,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origin" INET NOT NULL,
    "integrity_hash" CHAR(64) NOT NULL,
    CONSTRAINT "jaxon_tickets_pkey" PRIMARY KEY ("id")
);

-- 4. Maintenance (preventive/corrective)
CREATE TABLE "jaxon_maintenance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "asset_id" UUID NOT NULL,
    "ticket_id" UUID,
    "type" "maintenance_type" NOT NULL,
    "description" TEXT NOT NULL,
    "scheduled_date" TIMESTAMPTZ NOT NULL,
    "completed_date" TIMESTAMPTZ,
    "status" "maintenance_status" NOT NULL,
    "assigned_tech_id" UUID,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origin" INET NOT NULL,
    "integrity_hash" CHAR(64) NOT NULL,
    CONSTRAINT "jaxon_maintenance_pkey" PRIMARY KEY ("id")
);

-- 5. Audit Logs (immutable cryptographic ledger - INSERT ONLY)
CREATE TABLE "jaxon_audit_logs" (
    "id_log" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_table" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "payload_before" JSONB,
    "payload_after" JSONB NOT NULL,
    "actor_id" UUID NOT NULL,
    "ip_origin" INET NOT NULL,
    "hash_prev" CHAR(64) NOT NULL,
    "hash_current" CHAR(64) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "jaxon_audit_logs_pkey" PRIMARY KEY ("id_log")
);

-- ─────────────────────────────────────────────
-- UNIQUE INDEXES
-- ─────────────────────────────────────────────

CREATE UNIQUE INDEX "jaxon_users_email_key" ON "jaxon_users"("email");

-- ─────────────────────────────────────────────
-- PERFORMANCE INDEXES (B-Tree on FKs and status columns)
-- ─────────────────────────────────────────────

-- Assets
CREATE INDEX "idx_assets_assigned_to" ON "jaxon_assets"("assigned_to");
CREATE INDEX "idx_assets_status" ON "jaxon_assets"("status");

-- Tickets
CREATE INDEX "idx_tickets_asset_id" ON "jaxon_tickets"("asset_id");
CREATE INDEX "idx_tickets_status" ON "jaxon_tickets"("status");
CREATE INDEX "idx_tickets_assigned_tech" ON "jaxon_tickets"("assigned_tech_id");
CREATE INDEX "idx_tickets_risk_level" ON "jaxon_tickets"("inherent_risk_level");

-- Maintenance
CREATE INDEX "idx_maintenance_asset_id" ON "jaxon_maintenance"("asset_id");
CREATE INDEX "idx_maintenance_ticket_id" ON "jaxon_maintenance"("ticket_id");
CREATE INDEX "idx_maintenance_status" ON "jaxon_maintenance"("status");
CREATE INDEX "idx_maintenance_assigned_tech" ON "jaxon_maintenance"("assigned_tech_id");

-- Audit Logs
CREATE INDEX "idx_audit_entity" ON "jaxon_audit_logs"("entity_table", "entity_id");
CREATE INDEX "idx_audit_actor" ON "jaxon_audit_logs"("actor_id");
CREATE INDEX "idx_audit_hash_current" ON "jaxon_audit_logs"("hash_current");
CREATE INDEX "idx_audit_created_at" ON "jaxon_audit_logs"("created_at");

-- ─────────────────────────────────────────────
-- FOREIGN KEYS (all with ON DELETE NO ACTION)
-- ─────────────────────────────────────────────

-- Users (self-referencing audit)
ALTER TABLE "jaxon_users" ADD CONSTRAINT "jaxon_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_users" ADD CONSTRAINT "jaxon_users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Assets
ALTER TABLE "jaxon_assets" ADD CONSTRAINT "jaxon_assets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_assets" ADD CONSTRAINT "jaxon_assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_assets" ADD CONSTRAINT "jaxon_assets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Tickets
ALTER TABLE "jaxon_tickets" ADD CONSTRAINT "jaxon_tickets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "jaxon_assets"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_tickets" ADD CONSTRAINT "jaxon_tickets_assigned_tech_id_fkey" FOREIGN KEY ("assigned_tech_id") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_tickets" ADD CONSTRAINT "jaxon_tickets_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_tickets" ADD CONSTRAINT "jaxon_tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_tickets" ADD CONSTRAINT "jaxon_tickets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Maintenance
ALTER TABLE "jaxon_maintenance" ADD CONSTRAINT "jaxon_maintenance_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "jaxon_assets"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_maintenance" ADD CONSTRAINT "jaxon_maintenance_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "jaxon_tickets"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_maintenance" ADD CONSTRAINT "jaxon_maintenance_assigned_tech_id_fkey" FOREIGN KEY ("assigned_tech_id") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_maintenance" ADD CONSTRAINT "jaxon_maintenance_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "jaxon_maintenance" ADD CONSTRAINT "jaxon_maintenance_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Audit Logs
ALTER TABLE "jaxon_audit_logs" ADD CONSTRAINT "jaxon_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "jaxon_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
