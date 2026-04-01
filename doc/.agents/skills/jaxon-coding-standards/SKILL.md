---
name: jaxon-coding-standards
description: Coding standards and conventions specific to the J-axon v2.0.0 project. Always apply these rules when writing or reviewing code in this repository.
---

# J-axon Coding Standards

## Always Active Rules

These rules apply to **all** code in the J-axon repository without exception.

### 1. No Emojis, Stickers, or Unicode Symbols in Source Code

- **Do NOT** use emojis, stickers, or decorative Unicode characters in any source code file (`.ts`, `.tsx`, `.js`, `.jsx`, `.sql`, `.prisma`, etc.).
- This includes `console.log`, error messages, comments, variable names, and string literals.
- Use plain text for all log messages and output.

**Bad:**
```typescript
console.log("🌱 Seeding database...");
console.log("✅ User created");
console.log("❌ Error occurred");
```

**Good:**
```typescript
console.log("[SEED] Seeding database...");
console.log("[SEED] User created successfully");
console.error("[SEED] Error occurred");
```

### 2. Package Manager

- Use **pnpm** exclusively. No `npm` or `yarn` commands.

### 3. Logging Convention

- Use bracketed prefixes for log context: `[MODULE] message`
- Use `console.error` for errors, `console.warn` for warnings, `console.log` for info.
