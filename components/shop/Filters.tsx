"use client";

import { ChevronDown, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { FilterGroup, SortOption } from "../utils/types";

type FilterOptions = Record<FilterGroup, string[]>;

interface FiltersProps {
  activeTags: string[];
  selectedFilters: {
    Category: string[];
    Color: string[];
    Size: string[];
    Price: string[];
  };
  filterOptions: FilterOptions;
  sortBy: SortOption;
  openFilter: FilterGroup | null;
  setOpenFilter: Dispatch<SetStateAction<FilterGroup | null>>;
  onToggleOption: (group: FilterGroup, option: string) => void;
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
  onSortChange: (value: SortOption) => void;
}

export default function Filters({
  activeTags,
  selectedFilters,
  filterOptions,
  sortBy,
  openFilter,
  setOpenFilter,
  onToggleOption,
  onRemoveTag,
  onClearAll,
  onSortChange,
}: FiltersProps) {
  const filters: FilterGroup[] = ["Category", "Color", "Size", "Price"];

  return (
    <div className="px-4 sm:px-6 border-t border-black/5 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {filters.map((filter, index) => (
              <div key={filter} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setOpenFilter((prev) => (prev === filter ? null : filter))
                  }
                  className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase group"
                >
                  {filter}
                  <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {openFilter === filter && (
                  <div
                    className={`absolute top-full z-20 mt-3 max-h-60 min-w-48 overflow-y-auto rounded-2xl border border-black/10 bg-white p-3 shadow-sm ${
                      index >= 2 ? "right-0 sm:left-0 sm:right-auto" : "left-0"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {filterOptions[filter].map((option) => {
                        const isActive = selectedFilters[filter].includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => onToggleOption(filter, option)}
                            className={`text-left px-3 py-2 rounded-xl text-[10px] font-bold tracking-[0.1em] uppercase transition-colors ${
                              isActive ? "bg-black text-white" : "bg-black/5 hover:bg-black/10"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="relative shrink-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase sm:gap-4">
              <span className="text-black/40">Sort by:</span>
              <button
                type="button"
                onClick={() =>
                  onSortChange(
                    sortBy === "Newest Arrivals"
                      ? "Price: Low to High"
                      : sortBy === "Price: Low to High"
                      ? "Price: High to Low"
                      : sortBy === "Price: High to Low"
                      ? "Name: A-Z"
                      : "Newest Arrivals"
                  )
                }
                className="flex items-center gap-1.5 group"
              >
                {sortBy}
                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 flex-wrap">
          {activeTags.map((tag) => (
            <div
              key={tag}
              className="bg-black/5 px-3 py-1.5 flex items-center gap-2 group cursor-pointer hover:bg-black/10 transition-colors"
            >
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase">
                {tag}
              </span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3 text-black/40 group-hover:text-black transition-colors" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/40 ml-2 hover:text-black transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
