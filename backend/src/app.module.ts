import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResearchModule } from './research/research.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    ResearchModule,
  ],
})
export class AppModule {}
