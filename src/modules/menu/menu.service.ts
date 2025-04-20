import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Menu } from "./model/menu.model";
import mongoose, { Model } from "mongoose";
import { CreateMenuDto, UpdateMenuDto } from "./dto/menu.dto";

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

  async createMenu(data: CreateMenuDto, createdBy: string, file?: string) {
    const menu = await this.menuModel.create({
      ...data,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      ...(file && { image: file }),
    });

    return menu;
  }

  async getMenu(
    limit: number,
    page: number,
    category?: string,
    tags?: string[],
    search?: string
  ) {
    const filter: any = { isDeleted: false };

    if (category) {
      filter.category = category;
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (search) {
      filter.search = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }

    const menuItems = await this.menuModel
      .find(filter)
      .limit(limit)
      .skip(page * limit)
      .populate([
        {
          path: "createdBy",
          select: "username",
        },
      ]);
    if (!menuItems || menuItems.length === 0) {
      throw new NotFoundException("No menu items found");
    }

    return menuItems;
  }

  async getMenuById(id: string) {
    const item = await this.menuModel
      .findById(id)
      .populate("createdBy", "username");

    if (!item) {
      throw new NotFoundException("Menu item not found");
    }

    return item;
  }

  async deleteMenuById(id: string) {
    const menu = await this.getMenuById(id);

    menu.isDeleted = true;
    const deleted = await menu.save();

    if (!deleted) {
      throw new InternalServerErrorException("Failed to delete the menu item");
    }

    return deleted;
  }

  async updateMenuById(id: string, data: UpdateMenuDto, file?: string) {
    const menu = await this.getMenuById(id);
    Object.assign(menu, { ...data, ...(file ? { image: file } : {}) });

    const updatedMenu = await menu.save();

    if (!updatedMenu) {
      console.log("Failed to update menu:", menu);
      throw new InternalServerErrorException("Failed to update the menu item");
    }

    return updatedMenu;
  }
}
