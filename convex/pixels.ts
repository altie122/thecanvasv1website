import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const GetAllPixels = query({
  handler: async (ctx) => {
    const pixels = await ctx.db.query("Pixels").collect();
    return pixels;
  },
});

export const GetRowPixels = query({
  args: { x: v.number() },
  handler: async (ctx, args) => {
    const pixels = await ctx.db
      .query("Pixels")
      .withIndex("by_row", (q) => q.eq("x", args.x))
      .collect();
    return pixels;
  },
});

export const UpdatePixel = mutation({
  args: { x: v.number(), y: v.number(), color: v.string() },
  handler: async (ctx, args) => {
    const pixel = await ctx.db
      .query("Pixels")
      .withIndex("by_coordinates", (q) => q.eq("x", args.x).eq("y", args.y))
      .first();
    if (pixel) {
      try {
        await ctx.db.patch(pixel._id, {
          x: args.x,
          y: args.y,
          color: args.color,
        });
      } catch (error) {
        return error;
      }
    } else {
      try {
        await ctx.db.insert("Pixels", {
          x: args.x,
          y: args.y,
          color: args.color,
        });
      } catch (error) {
        return error;
      }
    };
    return "Success";
  },
});
