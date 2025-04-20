import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/modules/user/model/user.model";
import { Model } from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    const secret = configService.get<string>("TOKEN_SECRET");

    if (!secret) {
      throw new UnauthorizedException("Unauthorized");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.userModel.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: payload.id, role: user.role };
  }
}
