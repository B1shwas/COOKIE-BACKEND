import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async createUser(@Body() data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    return {
      message: "User created successfully",
      data: user,
    };
  }
}
