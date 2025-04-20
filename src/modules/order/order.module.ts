import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./model/order.model";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Cart, CartSchema } from "../cart/model/cart.model";
import { Menu, MenuSchema } from "../menu/model/menu.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Menu.name, schema: MenuSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
