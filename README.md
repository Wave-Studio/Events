# Events

Event Ticketing of the future

## Hosting

Events is built with [Deno Deploy](https://deno.com/deploy) support in mind but you should be able to selfhost this anywhere, just copy `.env.example` to `.env` and update the variables.
If you're selfhosting then KV requires an extra step with either creating a `db` folder for the database to be stored in or setting `DENO_DEPLOYMENT_ID` to anything for it to use the global version.
