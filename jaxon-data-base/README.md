# jaxon-data-base

SQL scripts for the J-axon v2.0.0 database schema. These scripts are compatible with **PostgreSQL 15+** and **Supabase**.

## Scripts

| File | Purpose |
|------|---------|
| `000_rollback.sql` | Drops all tables and enums (rollback) |
| `001_init_core_schema.sql` | Creates enums, tables, indexes, and foreign keys |
| `002_seed_admin.sql` | Inserts the bootstrap admin user |

## Usage

### Supabase SQL Editor

Execute the scripts in order:

1. `001_init_core_schema.sql` - Creates the full schema
2. `002_seed_admin.sql` - Seeds the admin user (update the password hash first)

### Rollback

Execute `000_rollback.sql` to drop everything and start fresh.

## Notes

- All tables use UUID v4 primary keys via `gen_random_uuid()`
- Audit columns are mandatory on all master tables (ISO 9001)
- `jaxon_audit_logs` is INSERT-ONLY (no UPDATE or DELETE)
- `ON DELETE CASCADE` is prohibited on transactional tables
