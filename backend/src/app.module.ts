import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResearchModule } from './research/research.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    SettingsModule,
    ResearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
