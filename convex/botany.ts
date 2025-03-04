import { query } from "./_generated/server";

export const getPlants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("botany").take(10);
  },
});
