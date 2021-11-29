import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AppConfigModule } from '../../config/app/app-config.module';
import { AuthModule } from '../../authentication/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
