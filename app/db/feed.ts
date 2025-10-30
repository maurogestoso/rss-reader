import { db } from "."
import { newItemsTable } from "./schema";

export async function getAllNewItems() {
  return db.select().from(newItemsTable);
}
