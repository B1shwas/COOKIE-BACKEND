import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 20)
  password: string;
}
