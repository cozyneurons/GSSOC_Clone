"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await fetchAPI("/health");
        setHealth(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    checkHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">GSSOC Platform Scaffolding</h1>
      
      <div className="p-6 border rounded-lg shadow-lg w-full max-w-md bg-white text-black">
        <h2 className="text-2xl font-semibold mb-4 text-center">Backend Status</h2>
        
        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <strong>Error:</strong> {error}
            <p className="text-sm mt-2">Ensure FastAPI backend is running on http://localhost:8000</p>
          </div>
        ) : health ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-md text-center">
            <strong>Status:</strong> {health.status}
            <p className="mt-2">{health.message}</p>
          </div>
        ) : (
          <div className="text-gray-500 text-center animate-pulse">
            Checking backend health...
          </div>
        )}
      </div>
    </main>
  );
}
