import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPlants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("botany").take(10);
  },
});

export const getPlantById = query({
  args: { id: v.id("botany") },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.id);
    return plant;
  },
});
