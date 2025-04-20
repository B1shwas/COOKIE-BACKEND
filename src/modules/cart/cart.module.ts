import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./model/cart.model";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { Menu, MenuSchema } from "../menu/model/menu.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Menu.name, schema: MenuSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
