import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./model/user.model";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto) {
    const duplicate = await this.userModel.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    });

    if (duplicate) {
      throw new BadRequestException("User already exists");
    }

    const newUser = await this.userModel.create(user);
    newUser.save();
    return newUser;
  }
}
