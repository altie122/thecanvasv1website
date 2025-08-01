import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const value = (await ctx.db.query("InModerationMode").first())?.value;
    return value;
  },
});
