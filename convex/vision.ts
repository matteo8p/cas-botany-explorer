"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const prompt = `
You will extract the text information about the plant scan. Return the information in a JSON format.

The JSON should have the following fields:
- taxonomic_name: The taxonomic name of the plant
- common_name: The common name of the plant
- family: The family of the plant
- genus: The genus of the plant
- species: The species of the plant
- subspecies: The subspecies of the plant
- variety: The variety of the plant
- elevation: The elevation of the plant
- form: The form of the plant
- plant_image_url: The URL of the plant image
- geographic_location: The geographic location of the plant
- collection_date: The date of the plant collection
- collector: The collector of the plant
- herbarium_code: The herbarium code of the plant
- accession_number: The accession number of the plant
- habitat: The habitat of the plant
- description: A description of the plant
- notes: Any additional notes about the plant

The JSON should be formatted as a JSON object, and return the object in {} brackets only.
`;

export const analyzeImage = action({
  args: {
    imageId: v.id("images"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const openai = new OpenAI({
        apiKey: "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",
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: args.url,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const analysis =
        response.choices[0]?.message?.content || "No analysis available";

      // Update the image with the analysis
      await ctx.runMutation(api.images.updateAnalysis, {
        imageId: args.imageId,
        analysis,
      });

      return analysis;
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMessage = "Failed to analyze image";

      // Update the image with the error message
      await ctx.runMutation(api.images.updateAnalysis, {
        imageId: args.imageId,
        analysis: errorMessage,
      });

      return errorMessage;
    }
  },
});
