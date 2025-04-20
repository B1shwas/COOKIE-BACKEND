import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/modules/menu/model/menu.model";
import { User } from "src/modules/user/model/user.model";
import {
  ORDER_STATUS,
  ORDER_TYPE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../enum/order.enum";

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      menuItemId: { type: Types.ObjectId, ref: Menu.name, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ])
  items: { menuItemId: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ type: Number, required: true, min: 0 })
  totalPrice: number;

  @Prop({ type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: {
      name: { type: String, required: false },
      contactNumber: { type: String, required: false },
      deliveryLocation: { type: String, required: false },
    },
    required: false,
  })
  details?: {
    name?: string;
    contactNumber?: string;
    deliveryLocation?: string;
  };

  @Prop({ type: String, enum: ORDER_TYPE, required: true })
  orderType: ORDER_TYPE;

  @Prop({ type: String, enum: PAYMENT_STATUS, required: true })
  paymentStatus: PAYMENT_STATUS;

  @Prop({ type: String, enum: PAYMENT_METHOD, required: true })
  paymentMethod: PAYMENT_METHOD;

  @Prop({
    type: { transactionId: { type: String, required: true } },
    required: false,
  })
  paymentInfo?: { transactionId: string };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
