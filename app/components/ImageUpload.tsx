"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { JsonView, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

export default function ImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveImage = useMutation(api.images.saveImage);
  const images = useQuery(api.images.getImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Get the upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file to storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Save the image metadata
      await saveImage({
        storageId,
        name: file.name,
        contentType: file.type,
        size: file.size,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const parseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return { error: "Invalid JSON data" };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Upload Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="border p-1.5 rounded text-sm"
        />
        {isUploading && <p className="text-blue-500 text-sm">Uploading...</p>}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Images</h2>
        <div className="grid grid-cols-1 gap-4">
          {images?.map((image) => (
            <div key={image._id} className="border rounded-md shadow-sm w=">
              <img
                src={image.url}
                alt={image.name}
                className="w-64 h-128 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-base mb-1.5 text-gray-700">
                  {image.name}
                </h3>
                <div className="bg-gray-50 rounded-md p-2 overflow-auto max-h-72">
                  <div className="font-mono text-sm">{image.analysis}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
