import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      menuItemId: { type: Types.ObjectId, ref: "Menu", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: { menuItemId: Types.ObjectId; quantity: number }[];

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
