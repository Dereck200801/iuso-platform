import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      date: new Date().toISOString(),
      message: 'IUSO NestJS API is running!' 
    }
  }
} 