import { Controller, Post, Body } from '@nestjs/common';
import { WebauthnService } from './webauthn.service';

@Controller('auth/webauthn')
export class AuthController {
  constructor(private wa: WebauthnService) {}

  @Post('registration/start')
  regStart(@Body() body: { handle?: string }) {
    return this.wa.registrationStart(body.handle);
  }

  @Post('registration/finish')
  regFinish(@Body() body: any) {
    return this.wa.registrationFinish(body);
  }

  @Post('login/start')
  loginStart(@Body() body: { handle?: string }) {
    return this.wa.loginStart(body.handle);
  }

  @Post('login/finish')
  loginFinish(@Body() body: any) {
    return this.wa.loginFinish(body);
  }
}
