import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    WinstonModule.forRoot({
      instance: winstonLogger,
    }),
  ],
  // controllers: [AppController, AuthController],
  // providers: [AppService, AuthService],
})
export class AppModule {}
