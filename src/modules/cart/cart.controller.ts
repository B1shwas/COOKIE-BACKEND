import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddCartItemDto, UpdateCartItemDto } from "./dto/cart.dto";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { Cart } from "./model/cart.model";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtGuard)
  @Post("add")
  async addItemToCart(
    @Body() addItemDto: AddCartItemDto,
    @Req() req: any
  ): Promise<Cart> {
    return await this.cartService.addItemToCart(req.user.id, addItemDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getCart(@Req() req: any): Promise<Cart> {
    return await this.cartService.getCart(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Put("update/:menuItemId")
  async updateCartItem(
    @Param("menuItemId") menuItemId: string,
    @Body() updateItemDto: UpdateCartItemDto,
    @Req() req: any
  ): Promise<Cart> {
    return await this.cartService.updateCartItem(
      req.user.id,
      menuItemId,
      updateItemDto
    );
  }

  @UseGuards(JwtGuard)
  @Delete("remove/:menuItemId")
  @HttpCode(200)
  async removeCartItem(
    @Param("menuItemId") menuItemId: string,
    @Req() req: any
  ): Promise<Cart> {
    return await this.cartService.removeCartItem(req.user.id, menuItemId);
  }

  @UseGuards(JwtGuard)
  @Delete("clear")
  @HttpCode(204)
  async clearCart(@Req() req: any): Promise<void> {
    return await this.cartService.clearCart(req.user.id);
  }
}
