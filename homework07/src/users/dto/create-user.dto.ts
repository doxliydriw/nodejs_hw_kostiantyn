import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateUserDto {
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(16)
  @Max(99)
  age: number;

}