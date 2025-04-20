import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtGuard } from "./guard/jwt.guard";
import { User } from "../user/model/user.model";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtGuard)
  @Post("logout")
  logout(@Req() req: Request & { user: User }) {
    const id = req.user.id;
    return this.authService.logout(id);
  }
}
