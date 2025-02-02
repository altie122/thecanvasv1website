// import { createClient, type Client } from "@libsql/client";
// import { drizzle } from "drizzle-orm/libsql";

// import { env } from "@/env";
// import * as schema from "./schema";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   client: Client | undefined;
// };

// let client: Client;
// if (env.NODE_ENV === "development") {
// client = globalForDb.client ?? createClient({ url: env.DATABASE_URL });
// globalForDb.client = client;
// } else {
// client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
// }

// export const db = drizzle(client, { schema });
