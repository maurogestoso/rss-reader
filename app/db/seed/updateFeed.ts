import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { updateFeed } from "../feed";

const argv = await yargs(hideBin(process.argv))
  .option("feedId", {
    demandOption: true,
    type: "number",
    describe: "Feed ID",
  })
  .parse();

await updateFeed({ feedId: argv.feedId });
