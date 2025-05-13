import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete,
  Put,
  HttpCode,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { Multer } from "multer";
import { CreateMenuDto, UpdateMenuDto } from "./dto/menu.dto";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { RolesGuard } from "../auth/guard/role.guard";
import { Roles } from "../auth/decorator/role.decorator";
import { ImageUploadInterceptor } from "src/common/interceptors/file.interceptor";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Post("create")
  @UseInterceptors(ImageUploadInterceptor("menu"))
  async createMenu(
    @UploadedFile() file: Multer.File,
    @Body("data") rawData: string,
    @Req() req: any
  ) {
    const data: CreateMenuDto = JSON.parse(rawData);
    const userId = req.user.id;
    const imageUrl = { url: `http://localhost:3001/${file.path}` };

    return this.menuService.createMenu(data, userId, imageUrl.url);
  }

  @Get("all")
  async getMenu(
    @Query("limit") limit: number,
    @Query("page") page: number,
    @Query("category") category?: string,
    @Query("tags") tags?: string[],
    @Query("search") search?: string
  ) {
    return await this.menuService.getMenu(limit, page, category, tags, search);
  }

  @Get(":id")
  async getMenuById(@Param("id") id: string) {
    return await this.menuService.getMenuById(id);
  }

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete("delete/:id")
  @HttpCode(200)
  async deleteMenuById(@Param("id") id: string) {
    return await this.menuService.deleteMenuById(id);
  }

  @Roles("ADMIN")
  @UseGuards(JwtGuard, RolesGuard)
  @Put("update/:id")
  @UseInterceptors(ImageUploadInterceptor("menu"))
  async updateMenuById(
    @Param("id") id: string,
    @Body() data: UpdateMenuDto,
    @UploadedFile() file?: Multer.File
  ) {
    const imageUrl = { url: `http://localhost:3001/${file.path}` };
    return await this.menuService.updateMenuById(id, data, imageUrl.url);
  }
}
