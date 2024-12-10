import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignupInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\dA-Za-z]{4,}$/u, {
    message: 'password is too weak',
  })
  password: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  language?: string;
}
