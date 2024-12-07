// src/book/book.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  // GET all books
  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  // GET book by ID
  async getBookById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  // CREATE a new book
  async createBook(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        cover: createBookDto.cover, // store the path of the cover image
        file: createBookDto.file, // store the path of the PDF file
      },
    });
  }

  // UPDATE an existing book
  async updateBook(id: number, updateBookDto: CreateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: {
        title: updateBookDto.title,
        description: updateBookDto.description,
        cover: updateBookDto.cover, // update cover path
        file: updateBookDto.file, // update PDF file path
      },
    });
  }

  // DELETE a book
  async deleteBook(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
