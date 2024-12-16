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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\dA-Za-z]{4,}$/u, {
    message: 'Password is too weak',
  })
  password!: string;

  @IsString()
  firstname!: string;

  @IsNumber()
  favouritePokemonId!: number;

  @IsBoolean()
  terms!: boolean;
}
