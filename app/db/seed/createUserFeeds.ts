import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { db } from "..";
import { feedsTable, newItemsTable, usersTable } from "../schema";
import { eq } from "drizzle-orm";

const argv = await yargs(hideBin(process.argv))
  .option("userId", {
    demandOption: true,
    type: "number",
    describe: "User ID",
  })
  .parse();

const result = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, argv.userId));

if (result.length === 0 || !result[0]) {
  throw new Error(`User with id ${argv.userId} not found`);
}

const user = result[0];

type NewFeed = typeof feedsTable.$inferInsert;
type NewItem = typeof newItemsTable.$inferInsert;

// TODO: pull data from actual feed
const rawFeed: NewFeed = {
  title: "kottke.org",
  link: "https://kottke.org",
  feedUrl: "https://feeds.kottke.org/main",
  userId: user.id,
};
const [{ id: feedId }] = await db
  .insert(feedsTable)
  .values(rawFeed)
  .returning();
console.info("Inserted feed with id:", feedId);

const items: NewItem[] = [
  {
    title:
      "Kara Walker Creates Haunted Beast From Butchered Confederate Statue",
    link: "https://kottke.org/25/10/kara-walker-creates-haunted-beast-from-butchered-confederate-statue",
    pubDate: new Date("2025-10-19T14:12:43Z"),
    feedId,
    userId: user.id,
  },
  {
    title: "Real Photos That Look Fake",
    link: "https://kottke.org/25/10/real-photos-that-look-fake",
    pubDate: new Date("2025-10-17T10:15:26Z"),
    feedId,
    userId: user.id,
  },
];

items.forEach(async (item) => {
  const [{ id }] = await db.insert(newItemsTable).values(item).returning();
  console.info("Inserted item with id:", id);
});
