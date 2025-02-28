"use client";

import ImageUpload from "./components/ImageUpload";

export default function Home() {
  return (
    <>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">CAS Zooniverse Demo</h1>
        <p className="text-center text-gray-500">
          Matthew Wang & Marcelo Jimenez
        </p>
        <div className="flex justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/2/26/California_Academy_of_Sciences_Logo.png"
            alt="CAS Logo"
            className="w-48 h-auto"
          />
        </div>
        <ImageUpload />
      </main>
    </>
  );
}
