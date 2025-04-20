import { Model } from "mongoose";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../user/model/user.model";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async generateToken(payload: { id: string; username: string }) {
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("TOKEN_SECRET"),
      expiresIn: "7d",
    });
    return token;
  }

  async login(data: LoginUserDto) {
    const user = await this.userModel.findOne({
      email: data.email,
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (typeof user.comparePassword === "function") {
      const isMatch = await user.comparePassword(data.password);

      if (!isMatch) {
        throw new BadRequestException("Invalid Credentials");
      }
    } else {
      throw new BadRequestException("Password comparison method not found");
    }

    const token = await this.generateToken({
      id: user.id,
      username: user.username,
    });

    const userWithToken = await this.userModel.findByIdAndUpdate(
      user.id,
      {
        token: token,
      },
      { new: true }
    );

    return {
      success: true,
      message: "Login successful",
      data: userWithToken,
    };
  }

  async logout(id: string) {
    const loggedOut = await this.userModel.findByIdAndUpdate(id, {
      token: null,
    });
    if (!loggedOut) {
      throw new InternalServerErrorException("Something went wrong");
    }

    return {
      success: true,
      message: "Logged out successful.",
    };
  }
}
