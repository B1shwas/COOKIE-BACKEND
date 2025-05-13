import { CommonModule } from "./../common/common.module";
import { Module } from "@nestjs/common";
import { AuthModule } from "src/modules/auth/auth.module";
import { CartModule } from "src/modules/cart/cart.module";
import { MenuModule } from "src/modules/menu/menu.module";
import { OrderModule } from "src/modules/order/order.module";
import { UserModule } from "src/modules/user/user.module";

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    MenuModule,
    CartModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
