"use client";

import ImageUpload from "./components/ImageUpload";

export default function Home() {
  return (
    <>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">Image Upload Demo</h1>
        <ImageUpload />
      </main>
    </>
  );
}
