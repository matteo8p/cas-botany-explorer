import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    contentType: v.string(),
    size: v.number(),
  },
  returns: v.id("images"),
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get image URL");
    }

    // Save the image with a pending analysis
    const imageId = await ctx.db.insert("images", {
      name: args.name,
      contentType: args.contentType,
      size: args.size,
      url,
      analysis: "Analyzing...", // Initial state while analysis is running
    });

    // Schedule the analysis
    await ctx.scheduler.runAfter(0, api.vision.analyzeImage, { imageId, url });

    return imageId;
  },
});

export const updateAnalysis = mutation({
  args: {
    imageId: v.id("images"),
    analysis: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.imageId, { analysis: args.analysis });
  },
});

export const getImages = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("images"),
      _creationTime: v.number(),
      name: v.string(),
      url: v.string(),
      contentType: v.string(),
      size: v.number(),
      analysis: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("images").collect();
  },
});
