import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Cart } from "./model/cart.model";
import { AddCartItemDto, UpdateCartItemDto } from "./dto/cart.dto";
import { Menu } from "../menu/model/menu.model";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Menu.name) private menuModel: Model<Menu>
  ) {}

  async addItemToCart(
    userId: string,
    addItemDto: AddCartItemDto
  ): Promise<Cart> {
    try {
      const { menuItemId, quantity } = addItemDto;

      const menuItem = await this.menuModel.findOne({
        _id: menuItemId,
        isAvailable: true,
        isDeleted: false,
      });
      if (!menuItem) {
        throw new NotFoundException("Menu item not found or unavailable");
      }

      let cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        cart = new this.cartModel({ userId, items: [], totalPrice: 0 });
      }

      const existingItem = cart.items.find(
        (item) => item.menuItemId.toString() === menuItemId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          menuItemId: new Types.ObjectId(menuItemId),
          quantity,
        });
      }

      cart.totalPrice = await this.calculateTotalPrice(cart.items);

      return await cart.save();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error adding item to cart");
    }
  }

  async getCart(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate("items.menuItemId", "name price image description category")
        .exec();
      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      cart.totalPrice = await this.calculateTotalPrice(cart.items);
      await cart.save();
      return cart;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error retrieving cart");
    }
  }

  async updateCartItem(
    userId: string,
    menuItemId: string,
    updateItemDto: UpdateCartItemDto
  ): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      const item = cart.items.find(
        (item) => item.menuItemId.toString() === menuItemId
      );
      if (!item) {
        throw new NotFoundException("Item not found in cart");
      }

      const menuItem = await this.menuModel.findOne({
        _id: menuItemId,
        isAvailable: true,
        isDeleted: false,
      });
      if (!menuItem) {
        throw new NotFoundException("Menu item not found or unavailable");
      }

      item.quantity = updateItemDto.quantity;
      cart.totalPrice = await this.calculateTotalPrice(cart.items);

      return await cart.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error updating cart item");
    }
  }

  async removeCartItem(userId: string, menuItemId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.menuItemId.toString() === menuItemId
      );
      if (itemIndex === -1) {
        throw new NotFoundException("Item not found in cart");
      }

      cart.items.splice(itemIndex, 1);
      cart.totalPrice = await this.calculateTotalPrice(cart.items);

      return await cart.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error removing cart item");
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error clearing cart");
    }
  }

  private async calculateTotalPrice(
    items: { menuItemId: Types.ObjectId; quantity: number }[]
  ): Promise<number> {
    let total = 0;
    for (const item of items) {
      const menuItem = await this.menuModel.findById(item.menuItemId);
      if (menuItem && menuItem.isAvailable && !menuItem.isDeleted) {
        total += menuItem.price * item.quantity;
      }
    }
    return total;
  }
}
