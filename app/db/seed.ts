import { eq } from "drizzle-orm";
import { db } from ".";
import { usersTable, feedsTable, newItemsTable } from "./schema";
import { createUser } from "./auth";

async function main() {
  await seedUser();
  await seedFeeds();
}

main();

async function seedUser() {
  const { insertedId } = await createUser({
    name: "Mauro",
    email: "mauro@example.com",
    password: "password",
  });

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, insertedId));

  return user
}

type NewFeed = typeof feedsTable.$inferInsert;
type NewItem = typeof newItemsTable.$inferInsert;

async function seedFeeds() {
  const rawFeed: NewFeed = { title: "kottke.org", link: "https://kottke.org", feedUrl: "https://feeds.kottke.org/main" }
  const [{ id: feedId }] = await db.insert(feedsTable).values(rawFeed).returning()
  const items: NewItem[] = [
    {
      title: "Kara Walker Creates Haunted Beast From Butchered Confederate Statue",
      link: "https://kottke.org/25/10/kara-walker-creates-haunted-beast-from-butchered-confederate-statue",
      pubDate: new Date("2025-10-19T14:12:43Z"),
      feedId
    },
    {
      title: "Real Photos That Look Fake",
      link: "https://kottke.org/25/10/real-photos-that-look-fake",
      pubDate: new Date("2025-10-17T10:15:26Z"),
      feedId,
    }
  ]

  items.forEach(async (item) => {
    await db.insert(newItemsTable).values(item)
  })

}



