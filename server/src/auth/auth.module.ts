import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WebauthnService } from './webauthn.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, WebauthnService],
  exports: [AuthService],
})
export class AuthModule {}
