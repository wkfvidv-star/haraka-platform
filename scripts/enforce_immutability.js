import prisma from '../server/prisma/client.js';

async function lockEventLogs() {
    console.log('🔒 Applying Native PostgreSQL Immutability Triggers to event_logs...');

    try {
        // 1. Create the Trigger Function that throws an exception on UPDATE or DELETE
        await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION prevent_audit_tampering()
      RETURNS TRIGGER AS $$
      BEGIN
          RAISE EXCEPTION 'CRITICAL SECURITY VIOLATION: The event_logs table is an Append-Only Forensic Ledger. UPDATE and DELETE operations are strictly forbidden at the database level.';
      END;
      $$ LANGUAGE plpgsql;
    `);

        // 2. Drop the trigger if it already exists (idempotency)
        await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS enforce_event_log_immutability ON "event_logs";
    `);

        // 3. Attach the Trigger to the event_logs table for BEFORE UPDATE and BEFORE DELETE
        await prisma.$executeRawUnsafe(`
      CREATE TRIGGER enforce_event_log_immutability
      BEFORE UPDATE OR DELETE ON "event_logs"
      FOR EACH ROW
      EXECUTE FUNCTION prevent_audit_tampering();
    `);

        console.log('✅ Forensic Immutability Lock Applied Successfully. The event_logs table is now mathematically append-only.');
    } catch (error) {
        console.error('❌ Failed to apply immutability locks:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

lockEventLogs();
