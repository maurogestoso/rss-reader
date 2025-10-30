import { eq } from "drizzle-orm";
import { db } from ".";
import { postsTable, usersTable } from "./schema";
import { createUser } from "./auth";

async function main() {
  const { insertedId } = await createUser({
    name: "Mauro",
    email: "mauro@example.com",
    password: "password",
  });

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, insertedId));

  const posts = [
    {
      title: "An app can be a homecooked meal",
      url: "https://www.robinsloan.com/notes/home-cooked-app/",
    },
    {
      title: "Home-Cooked Software and Barefoot Developers",
      url: "https://maggieappleton.com/home-cooked-software",
    },
    { title: "Build your own database", url: "https://www.nan.fyi/database" },
  ];

  posts.forEach(async (post, i) => {
    const postData: typeof postsTable.$inferInsert = {
      title: post.title,
      url: post.url,
      userId: user.id,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
    };
    const result = await db.insert(postsTable).values(postData).returning();
    console.info("Inserted post", result[0]);
  });
}

main();
