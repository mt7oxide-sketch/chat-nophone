/**
 * signal.service.ts
 * Server-side scaffold for integrating libsignal-protocol (Node/JS).
 *
 * IMPORTANT:
 * - This is a high-level implementation scaffold to show how to:
 *   - generate identity key pair & signed prekey
 *   - store prekey bundles for recipients
 *   - provide bundle to initiator for session setup
 *   - store encrypted messages as opaque blobs
 *
 * - You must `npm i libsignal-protocol` (or a maintained variant) and persist keys in DB.
 * - Cryptography is hard — review carefully before production.
 */
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
// The package name and usage may vary depending on libsignal distribution for Node.
// Example assumes `libsignal-protocol` (or `libsignal-protocol-node`) is available.
// import * as libsignal from 'libsignal-protocol';
// For the scaffold, we won't import the actual lib to keep the starter runnable without native deps.

type PreKeyBundle = {
  identityKey: string; // base64
  registrationId: number;
  signedPreKey: { id: number; publicKey: string; signature: string };
  preKeys: { id: number; publicKey: string }[];
};

// In-memory store (replace with Prisma DB)
const store = {
  bundles: new Map<string, PreKeyBundle>(), // userId -> PreKeyBundle
  messages: new Map<string, any[]>(),
};

@Injectable()
export class SignalService {
  // generate a fresh identity & prekey bundle for a user
  async generateAndStoreBundle(userId: string) {
    // In real impl: use libsignal to generate identityKeyPair, signedPreKey, preKeys, registrationId
    // Here we simulate with random bytes (NOT SECURE)
    const identityKey = randomBytes(32).toString('base64');
    const registrationId = Math.floor(Math.random() * 16380) + 1;
    const signedPreKey = { id: 1, publicKey: randomBytes(32).toString('base64'), signature: randomBytes(64).toString('base64') };
    const preKeys = Array.from({ length: 10 }).map((_, i) => ({ id: i + 2, publicKey: randomBytes(32).toString('base64') }));
    const bundle = { identityKey, registrationId, signedPreKey, preKeys };
    store.bundles.set(userId, bundle);
    return { ok: true, bundle }; 
  }

  async uploadPreKeys(userId: string, prekeyBundle: PreKeyBundle) {
    // Persist the provided bundle (called from client)
    store.bundles.set(userId, prekeyBundle);
    return { ok: true };
  }

  async getPreKeyBundle(userId: string) {
    const b = store.bundles.get(userId);
    if (!b) return { ok: false, error: 'not_found' };
    return { ok: true, bundle: b };
  }

  async deliverMessage(toUserId: string, ciphertext: Buffer | string, metadata: any) {
    const arr = store.messages.get(toUserId) ?? [];
    arr.push({ ciphertext: ciphertext instanceof Buffer ? ciphertext.toString('base64') : ciphertext, metadata, ts: Date.now() });
    store.messages.set(toUserId, arr);
    return { ok: true };
  }

  async fetchMessages(userId: string) {
    const arr = store.messages.get(userId) ?? [];
    store.messages.set(userId, []); // simple pop
    return { ok: true, messages: arr };
  }
}
