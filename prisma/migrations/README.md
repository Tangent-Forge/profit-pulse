# Database Migrations

This directory contains Prisma migrations for the Profit Pulse database schema.

## Running Migrations

### Development
```bash
# Create a new migration after schema changes
npm run db:migrate

# Push schema changes without creating migration (for prototyping)
npm run db:push

# View database in GUI
npm run db:studio
```

### Production
```bash
# Deploy pending migrations
npm run db:migrate:prod
```

## Migration History

Migrations are tracked in this directory. Each migration folder contains:
- `migration.sql` - The SQL executed for this migration
- Timestamp and description in folder name

## Important Notes

1. **Never modify existing migrations** - Create new ones instead
2. **Always test migrations** in development before deploying to production
3. **Backup your database** before running migrations in production
4. **Use the DIRECT_URL** env var for migrations (not pooled connection)

## Initial Setup

If this is your first time setting up the database:

```bash
# 1. Ensure your DATABASE_URL and DIRECT_URL are set in .env.local
# 2. Create the initial migration
npx prisma migrate dev --name initial_schema

# 3. The migration will:
#    - Create all tables defined in schema.prisma
#    - Set up indexes and relationships
#    - Apply any seed data (if configured)
```

## Troubleshooting

### Migration fails with "Connection refused"
- Check your DATABASE_URL is correct
- Ensure the database server is running
- Verify network connectivity

### "Database schema is not in sync"
```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or create a new migration to sync
npx prisma migrate dev
```

### Production deployment fails
- Ensure DIRECT_URL is set (not pooled connection)
- Run migrations separately from app deployment
- Never use `prisma migrate dev` in production
