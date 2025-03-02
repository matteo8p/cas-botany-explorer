"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

interface PlantAnalysis {
  taxonomic_name: string | null;
  common_name: string | null;
  family: string | null;
  genus: string | null;
  species: string | null;
  subspecies: string | null;
  variety: string | null;
  elevation: string | null;
  form: string | null;
  plant_image_url: string | null;
  geographic_location: string | null;
  collection_date: string | null;
  collector: string | null;
  herbarium_code: string | null;
  accession_number: string | null;
  habitat: string | null;
  description: string | null;
  notes: string | null;
}

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

const cleanAndValidateJSON = (jsonString: string): string => {
  try {
    // Try to parse the JSON string
    const parsed = JSON.parse(jsonString) as Partial<PlantAnalysis>;

    // Create a clean object with all expected fields
    const cleanObject: PlantAnalysis = {
      taxonomic_name: parsed.taxonomic_name || null,
      common_name: parsed.common_name || null,
      family: parsed.family || null,
      genus: parsed.genus || null,
      species: parsed.species || null,
      subspecies: parsed.subspecies || null,
      variety: parsed.variety || null,
      elevation: parsed.elevation || null,
      form: parsed.form || null,
      plant_image_url: parsed.plant_image_url || null,
      geographic_location: parsed.geographic_location || null,
      collection_date: parsed.collection_date || null,
      collector: parsed.collector || null,
      herbarium_code: parsed.herbarium_code || null,
      accession_number: parsed.accession_number || null,
      habitat: parsed.habitat || null,
      description: parsed.description || null,
      notes: parsed.notes || null,
    };

    // Convert back to a clean JSON string
    return JSON.stringify(cleanObject);
  } catch (e) {
    console.error("Failed to parse or clean JSON:", e);
    throw new Error("Invalid JSON format received from OpenAI");
  }
};

export const analyzeImage = action({
  args: {
    imageId: v.id("images"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
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

      const rawAnalysis = response.choices[0]?.message?.content;
      if (!rawAnalysis) {
        throw new Error("No analysis received from OpenAI");
      }

      // Clean and validate the JSON before saving
      const cleanJSON = cleanAndValidateJSON(rawAnalysis);

      // Update the image with the clean JSON
      await ctx.runMutation(api.images.updateAnalysis, {
        imageId: args.imageId,
        analysis: cleanJSON,
      });

      return cleanJSON;
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMessage = JSON.stringify({
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      });

      // Update the image with the error message as JSON
      await ctx.runMutation(api.images.updateAnalysis, {
        imageId: args.imageId,
        analysis: errorMessage,
      });

      return errorMessage;
    }
  },
});
