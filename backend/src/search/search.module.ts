import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ExaProvider } from '../providers/exa/exa.provider';

@Module({
  providers: [SearchService, ExaProvider],
  exports: [SearchService],
})
export class SearchModule {}
