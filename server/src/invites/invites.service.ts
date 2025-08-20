import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  create({ maxUses, expiresAt }: { maxUses?: number; expiresAt?: string }) {
    const code = randomBytes(6).toString('base64url');
    return { code, maxUses: maxUses ?? 1, expiresAt: expiresAt ?? null, url: `https://app/invite/${code}` };
  }
}
