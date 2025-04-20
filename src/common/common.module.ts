import { EsewaModule } from "@dallotech/nestjs-esewa";
import { PaymentMode } from "@dallotech/nestjs-esewa/dist/esewa.interface";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
          dbName: configService.get<string>("MONGO_DB"),
        };
      },
      inject: [ConfigService],
    }),
    EsewaModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        productCode: configService.get<string>(
          "ESEWA_PRODUCT_CODE",
          "EPAYTEST"
        ),
        paymentMode: configService.get<PaymentMode>(
          "ESEWA_PAYMENT_MODE",
          PaymentMode.TEST
        ),
        secretKey: configService.get<string>(
          "ESEWA_SECRET_KEY",
          "8gBm/:&EnhH.1/q"
        ),
        merchantId: configService.get<string>("ESEWA_MERCHANT_ID", "EPAYTEST"),
        merchantSecret: configService.get<string>(
          "ESEWA_MERCHANT_SECRET",
          "8gBm/:&EnhH.1/q"
        ),
      }),
    }),
  ],
})
export class CommonModule {}
