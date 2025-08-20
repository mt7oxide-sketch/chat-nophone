import { Controller, Post, Body, Param } from '@nestjs/common';
import { SignalService } from './signal.service';

@Controller('crypto')
export class CryptoController {
  constructor(private sig: SignalService) {}

  @Post('prekeys/:userId')
  upload(@Param('userId') userId: string, @Body() body: any) {
    return this.sig.uploadPreKeys(userId, body);
  }

  @Post('bundle/:userId')
  getBundle(@Param('userId') userId: string) {
    return this.sig.getPreKeyBundle(userId);
  }

  @Post('deliver/:to')
  deliver(@Param('to') to: string, @Body() body: any) {
    return this.sig.deliverMessage(to, body.cipher, body.meta ?? {});
  }
}
