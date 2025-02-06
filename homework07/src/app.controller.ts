import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

// Render for index.pug
  @Get()
  @Render('index')
  getHomePage() {
    return this.appService.getHomePage();
  }
// Render for register.pug
  @Get('/registration')
  @Render('register')
  getRegisterPage() {
    return this.appService.getRegisterPage();
  }
}
