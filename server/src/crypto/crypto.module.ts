import { Module } from '@nestjs/common';
import { SignalService } from './signal.service.impl';
import { CryptoController } from './crypto.controller';

@Module({ providers: [SignalService], controllers: [CryptoController], exports: [SignalService] })
export class CryptoModule {}
