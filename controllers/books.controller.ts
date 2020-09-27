import { Request, Response } from "express";

// DB
import { connection } from "../config/database";
// Interfaces
import { User } from "../interfaces/User";
import { Book } from "../interfaces/Book";
import { Category } from "../interfaces/Category";

//get all books
export async function getBooks(
  req: Request,
  res: Response
): Promise<Response | void> {
  await connection.query(
    "SELECT * FROM books ORDER BY id",
    (_, books: Book[]) => res.json(books)
  );
}

//create Book.
// receive just his name
export async function addBook({ body }: Request, res: Response) {
  const newBook: Book = body;
  await connection.query("INSERT INTO books SET ?", [newBook], (_, result) => {
    res.json({
      message: result === undefined ? "Name too long" : "New Book Created"
    });
  });
}

//get Book by id
//double destrusturing req -> params -> id_book
export async function getBook({ params: { id_book } }: Request, res: Response) {
  await connection.query(
    "SELECT * FROM books WHERE id = ?",
    [id_book],
    (_, book: Book[]) =>
      book.length !== 0
        ? res.json(book[0])
        : res.json({ message: `book ${id_book} doesnt exist` })
  );
}

//Delete Book by id
export async function deleteBook(
  { params: { id_book } }: Request,
  res: Response
) {
  await connection.query(
    "DELETE FROM books WHERE id = ?",
    [id_book],
    (_, { affectedRows }) =>
      res.json({
        message:
          affectedRows === 0 ? `Book ${id_book} does not exist` : "Book Deleted"
      })
  );
}

//Update Book by id
export async function updateBook(
  { body, params: { id_book } }: Request,
  res: Response
) {
  await connection.query(
    "UPDATE books set ? WHERE id = ?",
    [body as Book, id_book],
    (_, { affectedRows }) =>
      res.json({
        message:
          affectedRows === 0
            ? `Book ${id_book} does not exist`
            : `Book ${id_book} updated`
      })
  );
}

//list users of one Book
export async function listBookUsers(
  { params: id_book }: Request,
  res: Response
) {
  let sql = `SELECT users.* FROM users 
        inner join users_books 
        on users.id = users_books.id_user
        where id_book = ?`;
  await connection.query(sql, [id_book], (_, users: User[]) => {
    res.json(users);
  });
}

//add a category to the Book
export async function addCategoryToBook({ params }: Request, res: Response) {
  await connection.query(
    "INSERT INTO books_categories SET ?",
    [params],
    (_, result) => {
      res.json({
        message:
          result === undefined
            ? `The Book ${params.id_book} already allows the category ${params.id_category} or one of them do not exist`
            : `The Book ${params.id_book} owns category ${params.id_category}`
      });
    }
  );
}

//remove a category to the Book
export async function removeCategoryToBook(
  { params: { id_book, id_category } }: Request,
  res: Response
) {
  await connection.query(
    "DELETE FROM books_categories WHERE id_book = ? AND id_category = ?",
    [id_book, id_category],
    (_, {affectedRows} : {affectedRows : number}) =>
      res.json({
        message:
          affectedRows === 0
            ? `The Book ${id_book} did not allow the category ${id_category} or one of them do not exist`
            : `The Book ${id_book} does not allow category ${id_category} anymore`
      })
  );
}

//list categories of one Book
export async function listBookCastegories(
  { params: { id_book } }: Request,
  res: Response
) {
  let sql = `SELECT categories.* FROM categories 
        inner join books_categories 
        on categories.id = books_categories.id_category
        where id_book = ?`;
  await connection.query(sql, [id_book], (_, categories: Category[]) =>
    categories.length === 0
      ? res.json({ message: `The book ${id_book} doesnt exist` })
      : res.json(categories)
  );
}
