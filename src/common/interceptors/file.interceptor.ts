import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname, join } from "path";
import { BadRequestException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";

export function ImageUploadInterceptor(folder: string) {
  return FileInterceptor("image", {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join("uploads", folder);

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + extname(file.originalname);
        cb(null, uniqueSuffix);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(
          new BadRequestException("Only image files are allowed!"),
          false
        );
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}
