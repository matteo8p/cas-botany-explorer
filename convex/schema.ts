import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export const Image = {
  name: v.string(),
  contentType: v.string(),
  size: v.number(),
  url: v.string(),
  analysis: v.string(),
};

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  images: defineTable(Image),
});
