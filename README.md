# Home-cooked RSS Reader

A minimal rss-reader with just the functionality I need, and nothing more.

Inspired by Robin Sloan: [An app can be a home-cooked meal](https://www.robinsloan.com/notes/home-cooked-app/)

## Fork me!

You can fork this repo and run your own version of this app. The only requirement is an SQLite database.

1. Deploy the application. I use Vercel, but Cloudflare Workers and Netlify also support React Router applications by default. The repo has a `Dockerfile` which I assume it works, but haven't tried yet. See [React Router docs on Deploying](https://reactrouter.com/start/framework/deploying#nodejs-with-docker)
2. Create a database in [Turso](https://turso.tech/) (the free tier is more than enough for this application) and get the connection string and auth token. You'll need to set these as environment variables:
```
DB_CONNECTION_STRING="libsql://xxx.yyy.turso.io"
DB_AUTH_TOKEN="abc"
```
Alternatively, if you want to use a local file SQLite database (or for local development), you need environment variables like:
```
DB_CONNECTION_STRING="file:<path_to_file>"
```
I put these environment variables in `.env.development` and `.env.production` files locally for convenience.

If you look at `drizzle.config.ts` you can see how I have it setup to use a local DB in development and a Turso DB in production. You can change this to suit your needs, the key thing to change is the `dialect` property and load the correct environment variables.

3. Push the database schema by running `npm run db:push` (for development) or `npm run db:push:prod` (for production)

4. Create a user in the database by running:
```bash
npx dotenvx run -f <env-file> -- npx tsx app/db/seed/createUser.ts --email <email> --password <password>
```
This application is built for a single user (because that's all I need). All entities in the database (feeds and items) are not related to the user. You can have multiple users if you want, but they will have read/write access to the same data, which would be weird.

Authentication is done by storing a hash of the password in the database and using cookies for sessions (not stored in the database). I followed this page on [Sessions and Cookies](https://reactrouter.com/explanation/sessions-and-cookies#sessions) in the React Router docs. The application doesn't store any sensitive data, so high security wasn't a big concern. If you want to hack my RSS feeds for some reason, feel free :)

5. To explore the database, you can run `npm run db:studio` or `npm run db:studio:prod` and then access `https://local.drizzle.studio`

6. Enjoy decoupling your brain from platforms that want to exploit your attention for profit!
