import { Controller, Post, Body } from '@nestjs/common';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
  constructor(private invites: InvitesService) {}
  @Post()
  create(@Body() body: { maxUses?: number; expiresAt?: string }) {
    return this.invites.create(body);
  }
}
