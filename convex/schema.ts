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

export const Plant = {
  altCatalogNumber: v.union(v.float64(), v.string()),
  catalogNumber: v.float64(),
  ce_endDate: v.union(v.float64(), v.string()),
  ce_endDate1: v.union(v.float64(), v.string()),
  ce_startDate: v.union(v.float64(), v.string()),
  ce_startDate1: v.union(v.float64(), v.string()),
  class: v.string(),
  co_remarks: v.union(v.float64(), v.string()),
  co_yesNo2: v.union(v.float64(), v.string()),
  collectionObjectAttachments: v.union(v.float64(), v.string()),
  collectors: v.string(),
  continent: v.string(),
  count: v.string(),
  country: v.string(),
  determinedDate: v.string(),
  determiner: v.string(),
  endDate: v.union(v.float64(), v.string()),
  endDateVerbatim: v.string(),
  family: v.string(),
  fullName: v.string(),
  genus: v.string(),
  geoc: v.string(),
  img: v.string(),
  latitude1: v.union(v.float64(), v.string()),
  localityName: v.string(),
  longitude1: v.union(v.float64(), v.string()),
  maxElevation: v.union(v.float64(), v.string()),
  minElevation: v.union(v.float64(), v.string()),
  modifier: v.string(),
  order: v.string(),
  originalElevationUnit: v.string(),
  preparations: v.string(),
  remarks: v.string(),
  species: v.string(),
  startDate: v.union(v.float64(), v.string()),
  state: v.string(),
  stationFieldNumber: v.union(v.float64(), v.string()),
  text1: v.union(v.float64(), v.string()),
  timestampModified: v.string(),
  town: v.string(),
  tx_yesNo2: v.union(v.float64(), v.string()),
  typeStatusName: v.string(),
  verbatimDate: v.union(v.float64(), v.string()),
  yesNo2: v.union(v.float64(), v.string()),
};

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  images: defineTable(Image),
  botany: defineTable(Plant),
});
