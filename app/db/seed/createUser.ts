import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createUser } from "../auth";

const argv = await yargs(hideBin(process.argv))
  .option("email", {
    type: "string",
    describe: "User email",
    demandOption: true,
  })
  .option("password", {
    type: "string",
    describe: "User password",
    demandOption: true,
  })
  .parse();

const { insertedId } = await createUser({
  email: argv.email,
  password: argv.password,
  name: "Mauro",
});

console.info("Created user id:", insertedId);
