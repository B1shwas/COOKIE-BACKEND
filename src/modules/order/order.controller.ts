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
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/order.dto";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { RolesGuard } from "../auth/guard/role.guard";
import { Roles } from "../auth/decorator/role.decorator";
import { Order } from "./model/order.model";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post("create")
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any
  ): Promise<Order> {
    return await this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getUserOrders(@Req() req: any): Promise<Order[]> {
    return await this.orderService.getUserOrders(req.user.id);
  }

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Get("all")
  async getAllOrders(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Put("status/:orderId")
  async updateOrderStatus(
    @Param("orderId") orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ): Promise<Order> {
    return await this.orderService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(":orderId")
  @HttpCode(204)
  async deleteOrder(@Param("orderId") orderId: string): Promise<void> {
    return await this.orderService.deleteOrder(orderId);
  }

  @UseGuards(JwtGuard)
  @Post("esewa/initiate/:orderId")
  async initiatePayment(
    @Param("orderId") orderId: string,
    @Req() req: any
  ): Promise<{ paymentUrl: string }> {
    return await this.orderService.initiateEsewaPayment(orderId, req.user.id);
  }

  @Get("esewa/success")
  async handleEsewaSuccess(@Query("data") encodedData: string): Promise<Order> {
    return await this.orderService.verifyEsewaPayment(encodedData);
  }

  @Get("esewa/failure")
  async handleEsewaFailure(
    @Query("transaction_uuid") transactionUuid: string
  ): Promise<Order> {
    return await this.orderService.handleEsewaFailurre(transactionUuid);
  }
}
