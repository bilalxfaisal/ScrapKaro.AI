import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResearchModule } from './research/research.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ResearchModule,
  ],
})
export class AppModule {}
