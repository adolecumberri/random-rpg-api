import { Request, Response } from "express";

// DB
import { connection } from "../config/database";
// Interfaces
import { User } from "../interfaces/User";
import { Book } from "../interfaces/Book";

//get all users
export async function getUsers(
  req: Request,
  res: Response
): Promise<Response | void> {
  await connection.query(
    "SELECT * FROM users ORDER BY id",
    (_, users: User[]) => res.json(users)
  );
}

//create User.
// receive just his name
export async function addUser({ body }: Request, res: Response) {
  const newUser: User = body;
  console.log(newUser);
  await connection.query("INSERT INTO users SET ?", [newUser], (_, result) =>
    res.json({
      message: result === undefined ? "Name too long" : "New User Created"
    })
  );
}

//get User by id
//double destrusturing req -> params -> id_user
export async function getUser({ params: { id_user } }: Request, res: Response) {
  let sql = `SELECT * FROM users WHERE id = ${id_user};`;
  await connection.query(sql, (_, user: User[]) =>
    user.length !== 0
      ? res.json(user[0])
      : res.json({ message: `user ${id_user} does not exist` })
  );
}

//Delete User by id
export async function deleteUser(
  { params: { id_user } }: Request,
  res: Response
) {
  await connection.query(
    `DELETE FROM users WHERE id = ${id_user}`,
    (_, { affectedRows }) =>
      res.json({
        message:
          affectedRows === 0 ? `User ${id_user} does not exist` : "User Deleted"
      })
  );
}

//Update User by id
export async function updateUser(
  { body, params: { id_user } }: Request,
  res: Response
) {
  await connection.query(
    `UPDATE users set ? WHERE id = ${id_user}`,
    [body as User],
    (_, { affectedRows }) => {
      res.json({
        message:
          affectedRows === 0
            ? `User ${id_user} does not exist`
            : `User ${id_user} updated`
      });
    }
  );
}

//add Book to the User
export async function addBookToUser({ params }: Request, res: Response) {
  await connection.query(
    "INSERT INTO users_books SET ?",
    [params],
    (_, result) => {
      console.log(result);
      res.json({
        message:
          result === undefined
            ? `User ${params.id_user} already reads book ${params.id_book} OR one of them do not exist`
            : `User ${params.id_user} now reads ${params.id_book}`
      });
    }
  );
}

//remove Books to the user
export async function removeBookToUser(
  { params: { id_user, id_book } }: Request,
  res: Response
) {
  await connection.query(
    "DELETE FROM users_books WHERE id_user = ? AND id_book = ?",
    [id_user, id_book],
    (_, {affectedRows} : {affectedRows : number}) =>
      res.json({
        message:
          affectedRows === 0
            ? `User ${id_user} did not read the Book ${id_book} OR one of them do not exist`
            : `User ${id_user} doesnt read ${id_book} anymore`
      })
  );
}

//list Books of one user
export async function listUserBooks(
  { params: { id_user } }: Request,
  res: Response
) {
  let sql = `SELECT books.* FROM books 
        inner join users_books 
        on books.id = users_books.id_book
        where id_user = ?`;
        
  await connection.query(sql, [id_user], (_, books: Book[]) =>
    books.length === 0
      ? res.json({
          message: `User ${id_user} does not read books`
        })
      : res.json(books)
  );
}
