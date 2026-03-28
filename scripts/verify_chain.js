import prisma from '../server/prisma/client.js';
import { generateEventHash } from '../server/utils/forensic.js';

/**
 * 🕵️ Haraka Forensic Chain Verifier
 * This script iterates through all EventLog entries and verifies the 
 * cryptographic continuity of the previousHash -> currentHash relationship.
 */
async function verifyAuditChain() {
    console.log('🛡️ Initiating Full Forensic Hash Chain Verification...');

    try {
        const events = await prisma.eventLog.findMany({
            orderBy: { createdAt: 'asc' }
        });

        if (events.length === 0) {
            console.log('ℹ️ No events found in the ledger. Chain is empty but valid.');
            return;
        }

        let previousHash = 'GENESIS';
        let corruptionFound = false;

        console.log(`📊 Checking ${events.length} events...`);

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            // Calculate what the hash SHOULD be
            const expectedHash = generateEventHash(previousHash, event.payload);

            if (event.currentHash !== expectedHash) {
                console.error(`❌ CORRUPTION DETECTED at Event ID: ${event.id}`);
                console.error(`   Type: ${event.eventType} | Trace: ${event.traceId}`);
                console.error(`   Expected: ${expectedHash}`);
                console.error(`   Found:    ${event.currentHash}`);
                corruptionFound = true;
                break;
            }

            // Verify that the linked previousHash matches the actual previous event's currentHash
            const linkedPrevious = event.previousHash || 'GENESIS';
            if (linkedPrevious !== previousHash) {
                console.error(`❌ LINKAGE BREAK at Event ID: ${event.id}`);
                console.error(`   The "previousHash" field does not match the actual previous block hash.`);
                corruptionFound = true;
                break;
            }

            previousHash = event.currentHash;
        }

        if (!corruptionFound) {
            console.log('✅ HASH CHAIN VERIFIED: All events are cryptographically linked and untampered.');
        } else {
            console.log('🚨 FORENSIC SECURITY ALERT: The ledger has been tampered with or corrupted.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAuditChain();
