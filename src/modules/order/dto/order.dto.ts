import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional, IsString, ValidateNested } from "class-validator";
import { ORDER_STATUS, ORDER_TYPE, PAYMENT_METHOD } from "../enum/order.enum";

export class OrderDetailsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  deliveryLocation?: string;
}

export class EsewaPaymentInfoDto {
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  refId?: string;
}

export class CreateOrderDto {
  @IsMongoId()
  cartId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDetailsDto)
  details?: OrderDetailsDto;

  @IsEnum(ORDER_TYPE)
  orderType: ORDER_TYPE;

  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD;

  @IsOptional()
  @ValidateNested()
  @Type(() => EsewaPaymentInfoDto)
  paymentInfo?: EsewaPaymentInfoDto;
}

export class UpdateOrderStatusDto {
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;
}
