"use client";
import { Dispatch, SetStateAction } from "react";
import { Grid, List } from "lucide-react";

interface Props {
  results: number;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
}

export default function ProductToolbar({
  results,
  sort,
  setSort,
  view,
  setView,
}: Props) {
  return (
    <div className="w-full bg-red-50 backdrop-blur-md border-b border-gray-200 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between py-5 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Results count */}
        <p className="text-gray-700 font-medium">Showing results: {results}</p>

        {/* Right side controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200"
            aria-label="Sort products"
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                view === "grid" ? "bg-amber-100" : "hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <Grid size={22} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                view === "list" ? "bg-amber-100" : "hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <List size={22} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
