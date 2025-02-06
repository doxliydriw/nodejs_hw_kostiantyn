import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateUserDto {
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  age: number;
}