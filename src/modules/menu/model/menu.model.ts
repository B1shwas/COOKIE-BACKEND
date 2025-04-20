import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/modules/user/model/user.model";
import { CATEGORY } from "../enum/category.enum";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true })
export class Menu extends Document {
  @Prop({
    required: true,
    minlength: 3,
  })
  name: string;

  @Prop({
    required: true,
    min: 10000,
  })
  price: number;

  @Prop({
    required: false,
    default: true,
    type: Boolean,
  })
  isAvailable: boolean;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  createdBy: User;

  @Prop({
    required: false,
    default: false,
    type: Boolean,
  })
  isDeleted: boolean;

  @Prop({
    required: true,
    minlength: 9,
    maxlength: 250,
  })
  description: string;

  @Prop({
    required: true,
  })
  image: string;

  @Prop({
    required: false,
    min: 0,
    max: 999,
  })
  stock?: number;

  @Prop({
    required: true,
    enum: CATEGORY,
    default: CATEGORY.OTHER,
  })
  category: CATEGORY;

  @Prop({
    required: true,
  })
  tags: string[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
