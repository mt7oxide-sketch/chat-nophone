import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { PresenceService } from './presence.service';

@Module({ providers: [MessagingGateway, PresenceService] })
export class MessagingModule {}
