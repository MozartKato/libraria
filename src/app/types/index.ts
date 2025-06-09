import { User, Book, Borrow } from '@prisma/client';

export type UserWithRelations = User & {
  borrowedBooks: (Borrow & {
    book: Book;
  })[];
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type BorrowStatus = 'borrowed' | 'returned' | 'overdue';

export interface BorrowWithBook extends Borrow {
  book: Book;
}

export interface UserProfile extends Omit<User, 'password'> {
  borrowedBooks: BorrowWithBook[];
} 