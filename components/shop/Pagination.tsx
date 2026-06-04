"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  const visiblePages =
    totalPages <= 5
      ? pages
      : currentPage <= 3
      ? [1, 2, 3, 4, totalPages]
      : currentPage >= totalPages - 2
      ? [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      : [1, currentPage - 1, currentPage, currentPage + 1, totalPages];

  const normalizedPages = Array.from(new Set(visiblePages)).sort((a, b) => a - b);

  return (
    <div className="py-20 flex items-center justify-center gap-10">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 hover:bg-black/5 rounded-full transition-colors order-first disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-5 h-5 text-black/40" />
      </button>

      <div className="flex items-center gap-6">
        {normalizedPages.map((page, idx) => {
          const prev = normalizedPages[idx - 1];
          const showDots = idx > 0 && prev !== page - 1;

          return (
            <span key={page} className="flex items-center gap-6">
              {showDots && (
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
                  ...
                </span>
              )}

              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all
                  ${
                    page === currentPage
                      ? "border-b-2 border-black pb-0.5"
                      : "text-black/40 hover:text-black"
                  }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            </span>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 hover:bg-black/5 rounded-full transition-colors order-last disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}