import { Request, Response } from "express";

// DB
import { connection } from "../config/database";
// Interfaces
import { Category } from "../interfaces/Category";

//get all categories
export async function getCategories(
  _: Request,
  res: Response
): Promise<Response | void> {
  await connection.query(
    "SELECT * FROM categories ORDER BY id",
    (_, categories: Category[]) => res.json(categories)
  );
}

//create Categories.
// receive just his name
export async function addCategory({ body }: Request, res: Response) {
  const newCategory: Category = body;
  await connection.query(
    "INSERT INTO categories SET ?",
    [newCategory],
    (_, result) => {
      res.json({
        message:
          result === undefined
            ? "Category name too long"
            : "New category Created"
      });
    }
  );
}

//get Category by id
//double destrusturing req -> params -> id_category
export async function getCategory(
  { params: { id_category } }: Request,
  res: Response
) {
  await connection.query(
    "SELECT * FROM categories WHERE id = ?",
    [id_category],
    (_, category: Category[]) =>
      category.length
        ? res.json(category[0])
        : res.json({ message: `category ${id_category} does not exist` })
  );
}

//Delete Category by id
export async function deleteCategory(
  { params: {id_category} }: Request,
  res: Response
) {
  await connection.query(
    "DELETE FROM categories WHERE id = ?",
    [id_category],
    (_, { affectedRows }) =>
      res.json({
        message:
          affectedRows === 0 ? "Category does not exist" : "Category Deleted"
      })
  );
}

//Update Category by id
export async function updateCategory(
  { body, params: { id_category } }: Request,
  res: Response
) {
  await connection.query(
    `UPDATE categories set ? WHERE id = ${id_category}`,
    [body as Category],
    (_, { affectedRows }) => {
      res.json({
        message:
          affectedRows === 0
            ? `Category ${id_category} does not exist`
            : `Category ${id_category} updated`
      });
    }
  );
}
