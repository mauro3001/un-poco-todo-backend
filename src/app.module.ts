import { Module } from '@nestjs/common';
import { MarketplaceController } from './controllers/marketplace.controller';
import { NotionService } from './services/notion.service';

@Module({
  imports: [],
  controllers: [MarketplaceController],
  providers: [NotionService],
})
export class AppModule {}
