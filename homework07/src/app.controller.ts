import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './users/dto/create-user.dto';

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
