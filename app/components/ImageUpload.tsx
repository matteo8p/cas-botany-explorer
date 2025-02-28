"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

export default function ImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveImage = useMutation(api.images.saveImage);
  const images = useQuery(api.images.getImages);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Plant Analysis</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {images?.length || 0} images
            </span>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ease-in-out ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0])
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your image here, or click to upload
            </h3>
            <p className="text-sm text-gray-500">
              Supports: JPG, PNG, HEIC (max 10MB)
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isUploading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-blue-600 font-medium">
              Analyzing image...
            </span>
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images
            ?.slice()
            .reverse()
            .map((image) => (
              <div
                key={image._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-[4/3] relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <h3 className="font-medium text-gray-900">{image.name}</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                      {image.analysis}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {(!images || images.length === 0) && !isUploading && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-500">
              Upload your first image to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
