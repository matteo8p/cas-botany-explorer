"use client";

import DisplayPlants from "./components/display-plants";

export default function Home() {
  return (
    <>
      <header className="bg-gradient-to-b from-gray-50 to-white py-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center space-y-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/2/26/California_Academy_of_Sciences_Logo.png"
              alt="CAS Logo"
              className="w-48 h-auto"
            />
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                CAS Botany Viewer
              </h1>
              <p className="text-lg text-gray-600">
                Cool Plants from the CAS Herbarium
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>By</span>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Matthew Wang
                </a>
                <span>&</span>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Marcelo Jimenez
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <DisplayPlants />
      </main>
    </>
  );
}
