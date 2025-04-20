import { IsEmail, IsIn, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsString()
  @IsEmail()
  @Length(5, 20)
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  @IsIn(["ADMIN", "CUSTOMER"])
  role: string;
}
