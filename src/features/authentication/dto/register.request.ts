import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/u, {
    message:
      'Password must have at least 8 characters, including uppercase, lowercase, and a number',
  })
  password!: string;

  @IsString()
  name!: string;

  @IsNumber()
  favouritePokemonId!: number;

  @IsBoolean()
  terms!: boolean;
}
