import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Pixels: defineTable({
    x: v.number(),
    y: v.number(),
    color: v.string(),
  }).index("by_coordinates", ["x", "y"]).index("by_row", ["x"]),
});