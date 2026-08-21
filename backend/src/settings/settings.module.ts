import { Global, Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { UserApiKeysService } from './user-api-keys.service';

@Global()
@Module({
  controllers: [SettingsController],
  providers: [UserApiKeysService],
  exports: [UserApiKeysService],
})
export class SettingsModule {}
