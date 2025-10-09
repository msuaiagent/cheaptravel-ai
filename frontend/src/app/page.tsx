"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DestinationSearch from "./components/DestinationSearch";
import Link from "next/link";

export default function Home() {
  const [destinationsstate, setDestinations] = useState<any[]>([]);

  // Fetch destinations from the api
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/travel/destinations");
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load destinations:", err);
      }
    }
    fetchDestinations();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Search Section */}
      <section className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Find your next destination
        </h1>
        <DestinationSearch />
      </section>

      {/* Popular Destinations */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popular Destinations</h2>

        {destinationsstate.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400 italic">
            No destinations available right now. Try searching instead.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {destinationsstate.map((dest) => (
              <Link
                key={dest.id}
                href={`/budget?location=${encodeURIComponent(`${dest.name}, ${dest.country}`)}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition hover:scale-103 overflow-hidden"
              >
                {dest.image && (
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">{dest.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dest.description}
                  </p>
                  <p className="text-blue-600 text-sm font-medium">
                    {dest.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
