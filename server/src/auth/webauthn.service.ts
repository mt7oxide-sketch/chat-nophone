import { Injectable } from '@nestjs/common';
import { cfg } from '../config';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { randomUUID } from 'crypto';

// Demo in-memory stores — replace with DB (Prisma) in production
const mem = {
  challenges: new Map<string, string>(), // userId -> challenge
  users: new Map<string, { id: string; handle?: string; credentials: any[] }>() ,
  authenticators: new Map<string, any>(), // credentialID -> authenticator
};

@Injectable()
export class WebauthnService {
  async registrationStart(handle?: string) {
    const userId = randomUUID();
    const user = { id: userId, handle, credentials: [] };
    mem.users.set(userId, user);

    const opts = generateRegistrationOptions({
      rpName: cfg.webauthn.rpName,
      rpID: cfg.webauthn.rpID,
      userID: userId,
      userName: handle ?? userId,
      attestationType: 'none',
    });
    mem.challenges.set(userId, opts.challenge);
    return { userId, options: opts };
  }

  async registrationFinish(body: any) {
    const { userId, attResp } = body;
    const expectedChallenge = mem.challenges.get(userId);
    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge,
      expectedOrigin: cfg.webauthn.origin,
      expectedRPID: cfg.webauthn.rpID,
    });
    if (verification.verified) {
      const user = mem.users.get(userId)!;
      const info = verification.registrationInfo!;
      user.credentials.push(info);
      mem.authenticators.set(Buffer.from(info.credentialID).toString('base64url'), {
        credentialID: info.credentialID,
        credentialPublicKey: info.credentialPublicKey,
        counter: info.counter,
      });
    }
    return { ok: verification.verified };
  }

  async loginStart(handle?: string) {
    const user = [...mem.users.values()][0];
    const opts = generateAuthenticationOptions({
      rpID: cfg.webauthn.rpID,
      userVerification: 'preferred',
    });
    mem.challenges.set(user.id, opts.challenge);
    return { userId: user.id, options: opts };
  }

  async loginFinish(body: any) {
    const { userId, authResp } = body;
    const expectedChallenge = mem.challenges.get(userId);
    const credID = authResp.id;
    const authenticator = mem.authenticators.get(credID);
    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge,
      expectedOrigin: cfg.webauthn.origin,
      expectedRPID: cfg.webauthn.rpID,
      authenticator,
    });
    return { ok: verification.verified, token: verification.verified ? 'JWT_PLACEHOLDER' : null };
  }
}
