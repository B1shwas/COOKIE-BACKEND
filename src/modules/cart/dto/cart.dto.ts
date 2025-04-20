import { IsMongoId, IsNumber, Min, Max } from "class-validator";

export class AddCartItemDto {
  @IsMongoId()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
