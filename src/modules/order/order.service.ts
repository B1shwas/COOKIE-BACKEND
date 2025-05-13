import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import axios from "axios";
import { Order } from "./model/order.model";
import { Cart } from "../cart/model/cart.model";
import { Menu } from "../menu/model/menu.model";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/order.dto";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "./enum/order.enum";
import { v4 as uuid } from "uuid";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Menu.name) private menuModel: Model<Menu>
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    const { cartId, details, orderType, paymentMethod, paymentInfo } = dto;

    const cart = await this.cartModel.findOne({ _id: cartId, userId });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty or not found");
    }

    const orderItems: { menuItemId: Types.ObjectId; quantity: number; price: number }[] = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const menuItem = await this.menuModel.findOne({
        _id: item.menuItemId,
        isAvailable: true,
        isDeleted: false,
      });
      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });

      totalPrice += menuItem.price * item.quantity;
    }

    const transactionUuid =
      paymentMethod === PAYMENT_METHOD.ESEWA ? uuid() : undefined;

    const order = new this.orderModel({
      userId,
      items: orderItems,
      totalPrice,
      status: ORDER_STATUS.PENDING,
      isDeleted: false,
      details,
      orderType,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PENDING,
      transactionUuid,
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return await order.save();
  }

  async initiateEsewaPayment(
    orderId: string,
    userId: string
  ): Promise<{ paymentUrl: string }> {
    const order = await this.orderModel.findOne({ _id: orderId, userId });
    if (!order || order.isDeleted) {
      throw new NotFoundException("Order not found");
    }

    if (
      order.paymentMethod !== PAYMENT_METHOD.ESEWA ||
      order.paymentStatus !== PAYMENT_STATUS.PENDING
    ) {
      throw new BadRequestException("Invalid payment state");
    }

    const successUrl = `http://localhost:3001/order/esewa/success?q=su`;
    const failureUrl = `http://localhost:3001/order/esewa/failure?q=fu`;

    const params = new URLSearchParams({
      amt: order.totalPrice.toString(),
      psc: "0",
      pdc: "0",
      txAmt: "0",
      tAmt: order.totalPrice.toString(),
      pid: order.transactionUuid!,
      scd: "EPAYTEST",
      su: successUrl,
      fu: failureUrl,
    });

    return {
      paymentUrl: `https://rc-epay.esewa.com.np/api/epay/main?${params.toString()}`,
    };
  }

  async verifyEsewaPayment(
    pid: string,
    amt: number,
    refId: string
  ): Promise<Order> {
    try {
      const response = await axios.post(
        "https://rc-epay.esewa.com.np/api/epay/verify/",
        {
          amt,
          rid: refId,
          pid,
          scd: "EPAYTEST",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status !== "Success") {
        throw new BadRequestException("Esewa verification failed");
      }

      const order = await this.orderModel.findOne({ transactionUuid: pid });
      if (!order) {
        throw new NotFoundException("Order not found");
      }

      order.paymentStatus = PAYMENT_STATUS.COMPLETED;
      order.paymentInfo = { transactionId: pid, refId };

      return await order.save();
    } catch (err) {
      throw new InternalServerErrorException("Error verifying payment");
    }
  }

  async handleEsewaFailurre(transactionUuid: string): Promise<Order> {
    const order = await this.orderModel.findOne({
      transactionUuid,
      isDeleted: false,
    });

    if (!order) {
      throw new NotFoundException("Order not found for transaction");
    }

    order.paymentStatus = PAYMENT_STATUS.FAILED;
    return await order.save();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId, isDeleted: false })
      .populate("items.menuItemId", "name price image description category")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel
      .find({ isDeleted: false })
      .populate("items.menuItemId", "name price image description category")
      .populate("userId", "email")
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateOrderStatus(
    orderId: string,
    dto: UpdateOrderStatusDto
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order || order.isDeleted) {
      throw new NotFoundException("Order not found");
    }

    order.status = dto.status;
    return await order.save();
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await this.orderModel.findById(orderId);
    if (!order || order.isDeleted) {
      throw new NotFoundException("Order not found");
    }

    order.isDeleted = true;
    await order.save();
  }
}
