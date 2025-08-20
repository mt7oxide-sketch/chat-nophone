import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { cfg } from './config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: cfg.jwtSecret,
      signOptions: { expiresIn: '30d' },
    }),
    AuthModule,
    UsersModule,
    InvitesModule,
    // CryptoModule,

    MessagingModule,
    // Crypto
    
  ],
})
export class AppModule {}

// NOTE: add Crypto module/service wiring here when integrating Signal.

// To enable CryptoModule: import it and add to @Module imports when integrating Signal.
