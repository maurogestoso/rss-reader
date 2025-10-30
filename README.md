# Home-cooked RSS Reader

A minimal rss-reader with just the functionality I need, and nothing more.

Inspired by Robin Sloan: [An app can be a home-cooked meal](https://www.robinsloan.com/notes/home-cooked-app/)

## DB Ops

### Create a new user
```bash
npx dotenvx run -f <env-file> -- npx tsx app/db/seed/createUser.ts --email <email> --password <password>
```
