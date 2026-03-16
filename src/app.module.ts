import { Module } from '@nestjs/common';
import { AppController,InfoController } from './app.controller';
import { AppService } from './app.service';
import { InfoService } from './app.InfoService';
import { PrismaService } from './prisma.service';
import { InfoGateWay } from './app.getway'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    })
  ],
  controllers: [AppController,InfoController],
  providers: [AppService,InfoService,PrismaService,InfoGateWay],
})
export class AppModule {}
