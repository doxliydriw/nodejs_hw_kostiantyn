import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHomePage() {
    return {
      title: 'Welcome to My NestJS App',
      message: 'This is a simple page rendered using Pug.',
    };
  }

  getRegisterPage() {
    return {
      title: 'Register',
      message: 'Please fill out the form below to register.',
    };
  }
}
