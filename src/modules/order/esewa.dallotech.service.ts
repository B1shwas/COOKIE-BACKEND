// import {
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
//   BadRequestException,
// } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model, Types } from "mongoose";
// import { Order } from "./model/order.model";
// import { Cart } from "../cart/model/cart.model";
// import { Menu } from "../menu/model/menu.model";
// import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/order.dto";
// import {
//   ORDER_STATUS,
//   PAYMENT_METHOD,
//   PAYMENT_STATUS,
// } from "./enum/order.enum";
// import { v4 as uuid } from "uuid";
// import { EsewaRequestDto, EsewaService } from "@dallotech/nestjs-esewa";

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectModel(Order.name) private orderModel: Model<Order>,
//     @InjectModel(Cart.name) private cartModel: Model<Cart>,
//     @InjectModel(Menu.name) private menuModel: Model<Menu>,
//     private esewaService: EsewaService
//   ) {}

//   async createOrder(
//     userId: string,
//     createOrderDto: CreateOrderDto
//   ): Promise<Order> {
//     try {
//       const { cartId, details, orderType, paymentMethod, paymentInfo } =
//         createOrderDto;

//       const cart = await this.cartModel.findOne({ _id: cartId, userId });
//       if (!cart || cart.items.length === 0) {
//         throw new BadRequestException("Cart is empty or not found");
//       }

//       const orderItems: {
//         menuItemId: Types.ObjectId;
//         quantity: number;
//         price: number;
//       }[] = [];
//       let totalPrice = 0;
//       for (const item of cart.items) {
//         const menuItem = await this.menuModel.findOne({
//           _id: item.menuItemId,
//           isAvailable: true,
//           isDeleted: false,
//         });
//         if (!menuItem) {
//           throw new NotFoundException(
//             `Menu item ${item.menuItemId} not found or unavailable`
//           );
//         }
//         orderItems.push({
//           menuItemId: item.menuItemId,
//           quantity: item.quantity,
//           price: menuItem.price,
//         });
//         totalPrice += menuItem.price * item.quantity;
//       }

//       if (paymentMethod === PAYMENT_METHOD.ESEWA && paymentInfo) {
//         throw new BadRequestException(
//           "Payment info should not be provided during order creation for ESEWA"
//         );
//       }

//       if (paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY && paymentInfo) {
//         throw new BadRequestException(
//           "Payment info not allowed for CASH_ON_DELIVERY"
//         );
//       }

//       const transactionUuid =
//         paymentMethod === PAYMENT_METHOD.ESEWA ? uuid() : undefined;

//       const order = new this.orderModel({
//         userId,
//         items: orderItems,
//         totalPrice,
//         status: ORDER_STATUS.PENDING,
//         isDeleted: false,
//         details,
//         orderType,
//         paymentMethod,
//         paymentStatus: PAYMENT_STATUS.PENDING,
//         transactionUuid,
//       });

//       cart.items = [];
//       cart.totalPrice = 0;
//       await cart.save();

//       return await order.save();
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Error creating order");
//     }
//   }

//   async getUserOrders(userId: string): Promise<Order[]> {
//     try {
//       const orders = await this.orderModel
//         .find({ userId, isDeleted: false })
//         .populate("items.menuItemId", "name price image description category")
//         .sort({ createdAt: -1 })
//         .exec();
//       return orders;
//     } catch (error) {
//       throw new InternalServerErrorException("Error retrieving user orders");
//     }
//   }

//   async initiateEsewaPayment(
//     orderId: string,
//     userId: string
//   ): Promise<{ paymentUrl: string }> {
//     try {
//       const order = await this.orderModel.findOne({
//         _id: orderId,
//         userId,
//         isDeleted: false,
//       });
//       if (!order) {
//         throw new NotFoundException("Order not found");
//       }

//       if (
//         order.paymentMethod !== PAYMENT_METHOD.ESEWA ||
//         order.paymentStatus !== PAYMENT_STATUS.PENDING
//       ) {
//         throw new BadRequestException(
//           "Payment is not pending or ESEWA payment is not set"
//         );
//       }

//       const esewaRequestDto: EsewaRequestDto = {
//         amount: order.totalPrice,
//         productServiceCharge: 0,
//         productDeliveryCharge: 0,
//         taxAmount: 0,
//         totalAmount: order.totalPrice,
//         transactionUuid: order.transactionUuid!,
//         successUrl: "http://localhost:3001/order/esewa/success",
//         failureUrl: "http://localhost:3001/order/esewa/failure",
//       };

//       const initData = await this.esewaService.init(esewaRequestDto);
//       return { paymentUrl: initData.payment_url };
//     } catch (error) {
//       console.log(error);
//       throw new InternalServerErrorException("Error while initiationg ESEWA");
//     }
//   }

//   async verifyEsewaPayment(encodedData: string): Promise<Order> {
//     try {
//       const response = await this.esewaService.verify({ encodedData });

//       const responseData = response.data as {
//         success: boolean;
//         data: { transactionUuid: string; refId?: string };
//       };

//       if (!responseData.success) {
//         throw new BadRequestException("Payment verification failed");
//       }

//       const { transactionUuid, refId } = responseData.data;

//       const order = await this.orderModel.findOne({
//         transactionUuid,
//         isDeleted: false,
//       });

//       if (!order) {
//         throw new NotFoundException("Order not found for this transaction");
//       }

//       order.paymentStatus = PAYMENT_STATUS.COMPLETED;
//       order.paymentInfo = { transactionId: transactionUuid, refId };

//       return await order.save();
//     } catch (error) {
//       throw new InternalServerErrorException("Error verifying ESEWA payment");
//     }
//   }

//   async handleEsewaFailurre(transactionUuid: string): Promise<Order> {
//     try {
//       const order = await this.orderModel.findOne({
//         transactionUuid,
//         isDeleted: false,
//       });

//       if (!order) {
//         throw new NotFoundException("Order not found for transaction");
//       }

//       order.paymentStatus = PAYMENT_STATUS.FAILED;
//       return await order.save();
//     } catch (error) {
//       throw new InternalServerErrorException("Error verifying ESEWA");
//     }
//   }

//   async getAllOrders(): Promise<Order[]> {
//     try {
//       const orders = await this.orderModel
//         .find({ isDeleted: false })
//         .populate("items.menuItemId", "name price image description category")
//         .populate("userId", "email")
//         .sort({ createdAt: -1 })
//         .exec();
//       return orders;
//     } catch (error) {
//       throw new InternalServerErrorException("Error retrieving all orders");
//     }
//   }

//   async updateOrderStatus(
//     orderId: string,
//     updateStatusDto: UpdateOrderStatusDto
//   ): Promise<Order> {
//     try {
//       const order = await this.orderModel.findById(orderId);
//       if (!order || order.isDeleted) {
//         throw new NotFoundException("Order not found");
//       }

//       order.status = updateStatusDto.status;
//       return await order.save();
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Error updating order status");
//     }
//   }

//   async deleteOrder(orderId: string): Promise<void> {
//     try {
//       const order = await this.orderModel.findById(orderId);
//       if (!order || order.isDeleted) {
//         throw new NotFoundException("Order not found");
//       }

//       order.isDeleted = true;
//       await order.save();
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException("Error deleting order");
//     }
//   }
// }
