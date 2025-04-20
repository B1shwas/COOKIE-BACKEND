import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { CATEGORY } from "../enum/category.enum";
import { PartialType } from "@nestjs/mapped-types";

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(10000)
  price: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean = false;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(250)
  description: string;

  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // image?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(999)
  stock?: number;

  @IsEnum(CATEGORY)
  category: CATEGORY;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
