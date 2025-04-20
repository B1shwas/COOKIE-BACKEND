import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./model/order.model";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Cart, CartSchema } from "../cart/model/cart.model";
import { Menu, MenuSchema } from "../menu/model/menu.model";
import { EsewaModule } from "@dallotech/nestjs-esewa";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PaymentMode } from "@dallotech/nestjs-esewa/dist/esewa.interface";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Menu.name, schema: MenuSchema },
    ]),
    EsewaModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const productCode = configService.get<string>("ESEWA_PRODUCT_CODE");
        const paymentMode =
          configService.get<PaymentMode>("ESEWA_PAYMENT_MODE");
        const secretKey = configService.get<string>("ESEWA_SECRET_KEY");
        const merchantId = configService.get<string>("ESEWA_MERCHANT_ID");
        const merchantSecret = configService.get<string>(
          "ESEWA_MERCHANT_SECRET"
        );

        if (
          !productCode ||
          !paymentMode ||
          !secretKey ||
          !merchantId ||
          !merchantSecret
        ) {
          throw new Error("Missing required Esewa configuration");
        }

        return {
          productCode,
          paymentMode,
          secretKey,
          merchantId,
          merchantSecret,
        };
      },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
