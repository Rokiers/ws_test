import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InfoBrief, InfoService } from './app.InfoService';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('info')
export class InfoController {
  constructor (private readonly InfoService:InfoService ){}

  @Get()
  async getInfo():Promise<InfoBrief[]>{
    return await this.InfoService.getInfo();
  }
}