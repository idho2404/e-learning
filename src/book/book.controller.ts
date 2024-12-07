import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Put,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '../auth/role.enum'; // import your Role enum

@Controller('api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET All Books (accessible by any authenticated user)
  @Get()
  @UseGuards(JwtAuthGuard) // Only accessible with JWT token
  async getAllBooks() {
    try {
      return await this.bookService.getAllBooks();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  // GET Book by ID (accessible by any authenticated user)
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Only accessible with JWT token
  async getBookById(@Param('id') id: number) {
    try {
      return await this.bookService.getBookById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch book with ID ${id}`,
      );
    }
  }

  // Admin - POST Create Book (only accessible by ADMIN)
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role-based access
  @Roles(Role.ADMIN) // Only ADMIN can access
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder =
            file.fieldname === 'cover'
              ? './uploads/file/cover'
              : './uploads/file/library';
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'cover') {
          if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            return cb(
              new Error('Only PNG and JPEG images are allowed for cover.'),
              false,
            );
          }
        } else if (file.fieldname === 'file') {
          if (file.mimetype !== 'application/pdf') {
            return cb(
              new Error('Only PDF files are allowed for books.'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.fieldname === 'cover') {
          createBookDto.cover = file.filename;
        } else if (file.fieldname === 'file') {
          createBookDto.file = file.filename;
        }
      });
    }
    try {
      return await this.bookService.createBook(createBookDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  // Admin - PUT Update Book (only accessible by ADMIN)
  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role-based access
  @Roles(Role.ADMIN) // Only ADMIN can access
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder =
            file.fieldname === 'cover'
              ? './uploads/file/cover'
              : './uploads/file/library';
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'cover') {
          if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            return cb(
              new Error('Only PNG and JPEG images are allowed for cover.'),
              false,
            );
          }
        } else if (file.fieldname === 'file') {
          if (file.mimetype !== 'application/pdf') {
            return cb(
              new Error('Only PDF files are allowed for books.'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: CreateBookDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.fieldname === 'cover') {
          updateBookDto.cover = file.filename;
        } else if (file.fieldname === 'file') {
          updateBookDto.file = file.filename;
        }
      });
    }
    try {
      return await this.bookService.updateBook(id, updateBookDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  // Admin - DELETE Book (only accessible by ADMIN)
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role-based access
  @Roles(Role.ADMIN) // Only ADMIN can access
  async deleteBook(@Param('id') id: number) {
    try {
      return await this.bookService.deleteBook(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete book with ID ${id}`,
      );
    }
  }
}
