import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { Document } from "mongoose";

export type UserRole = "ADMIN" | "CUSTOMER";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, minlength: 5, unique: true })
  email: string;

  @Prop({ required: true, minlength: 5 })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token?: string;

  @Prop({ required: true })
  role: UserRole;

  comparePassword?: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next: NextFunction) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
