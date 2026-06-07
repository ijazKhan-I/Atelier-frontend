// "use client";

// import ProductCard from "./ProductCard";
// import { Product } from "@/type/shopType";
// import Filter from "./Filter";
// type ProductGridProps = {
//   products: Product[];
// };

// export default function ProductGrid({products}:ProductGridProps) {
//   return (
//     <div>
//       <Filter data={products} />
//       <section id="products" className="section-container py-12">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


// ////http://localhost:1337/api/categories?filters[slug][$eq]=shoose&populate[image][populate]=*&populate[products][populate][image][populate]=*&populate[products][populate][productVariation][populate]=*






// //http://localhost:1337/api/categories?filters[slug][$eq]=cloths&populate[image][populate]=*&populate[products][populate][image][populate]=*&populate[products][populate][productVariation][populate]=*


// //https://nishatlinen.com/products/42601696


"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Filters from "./Filters";
import Pagination from "./Pagination";
import type {
  FilterGroup,
  SortOption,
} from "../utils/types";
import type { Product as StrapiProduct } from "@/type/shopType";

type Props = {
  products: StrapiProduct[];
  searchQuery?: string;
};

function matchesSearch(product: StrapiProduct, searchQuery: string) {
  if (!searchQuery) return true;

  const query = searchQuery.toLowerCase();
  const haystack = [
    product.name,
    product.description,
    product.category?.name,
    ...(product.productVariation?.map((variation) => variation.name) ?? []),
    ...(product.productVariation?.map((variation) => variation.size) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

const ITEMS_PER_PAGE = 6;

const emptyFilters = {
  Category: [] as string[],
  Color: [] as string[],
  Size: [] as string[],
  Price: [] as string[],
};

type FilterOptions = Record<FilterGroup, string[]>;

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

function sortSizes(values: string[]) {
  return [...values].sort((a, b) => {
    const rankA = SIZE_ORDER.indexOf(a);
    const rankB = SIZE_ORDER.indexOf(b);

    if (rankA === -1 && rankB === -1) return a.localeCompare(b);
    if (rankA === -1) return 1;
    if (rankB === -1) return -1;

    return rankA - rankB;
  });
}

function buildFilterOptions(products: StrapiProduct[]): FilterOptions {
  const categories = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const hasPriceUnder500 = products.some((product) => {
    const price = product.productVariation?.[0]?.price ?? product.price;
    return price < 500;
  });
  const hasPriceBetween500And1000 = products.some((product) => {
    const price = product.productVariation?.[0]?.price ?? product.price;
    return price >= 500 && price <= 1000;
  });
  const hasPriceAbove1000 = products.some((product) => {
    const price = product.productVariation?.[0]?.price ?? product.price;
    return price > 1000;
  });

  products.forEach((product) => {
    if (product.category?.name) {
      categories.add(product.category.name);
    }

    product.productVariation?.forEach((variation) => {
      if (variation.name) colors.add(variation.name);
      if (variation.size) sizes.add(variation.size);
    });
  });

  return {
    Category: [...categories].sort((a, b) => a.localeCompare(b)),
    Color: [...colors].sort((a, b) => a.localeCompare(b)),
    Size: sortSizes([...sizes]),
    Price: [
      ...(hasPriceUnder500 ? ["Under $500"] : []),
      ...(hasPriceBetween500And1000 ? ["$500 - $1,000"] : []),
      ...(hasPriceAbove1000 ? ["$1,000+"] : []),
    ],
  };
}

export default function ProductGrid({ products, searchQuery = "" }: Props) {
  
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [sortBy, setSortBy] = useState<SortOption>("Newest Arrivals");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState<FilterGroup | null>(null);
  const filterOptions = useMemo(() => buildFilterOptions(products), [products]);

  const activeTags = useMemo(() => {
    return Object.entries(selectedFilters).flatMap(([group, values]) =>
      values.map((value) => `${group}: ${value}`)
    );
  }, [selectedFilters]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (!matchesSearch(product, searchQuery)) {
        return false;
      }

      const firstVariation = product.productVariation?.[0];

      const category = product.category?.name ?? "";
      const color = firstVariation?.name ?? "";
      const size = firstVariation?.size ?? "";
      const priceValue = firstVariation?.price ?? product.price;

      const categoryOk =
        selectedFilters.Category.length === 0 ||
        selectedFilters.Category.includes(category);

      const colorOk =
        selectedFilters.Color.length === 0 ||
        selectedFilters.Color.includes(color);

      const sizeOk =
        selectedFilters.Size.length === 0 ||
        selectedFilters.Size.includes(size);

      const priceOk =
        selectedFilters.Price.length === 0 ||
        selectedFilters.Price.some((range) => {
          if (range === "Under $500") return priceValue < 500;
          if (range === "$500 - $1,000") {
            return priceValue >= 500 && priceValue <= 1000;
          }
          if (range === "$1,000+") return priceValue > 1000;
          return true;
        });

      return categoryOk && colorOk && sizeOk && priceOk;
    });

    const sorted = [...filtered].sort((a, b) => {
      const priceA = a.productVariation?.[0]?.price ?? a.price;
      const priceB = b.productVariation?.[0]?.price ?? b.price;

      if (sortBy === "Price: Low to High") return priceA - priceB;
      if (sortBy === "Price: High to Low") return priceB - priceA;
      if (sortBy === "Name: A-Z") return a.name.localeCompare(b.name);

      // Newest Arrivals
      return b.id - a.id;
    });

    return sorted;
  }, [products, selectedFilters, sortBy, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleOption = (group: FilterGroup, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group];
      const exists = current.includes(option);

      return {
        ...prev,
        [group]: exists
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const removeTag = (tag: string) => {
    const [group, value] = tag.split(": ") as [FilterGroup, string];

    if (!group || !value) return;

    setSelectedFilters((prev) => ({
      ...prev,
      [group]: prev[group].filter((item) => item !== value),
    }));
  };

  const clearAll = () => {
    setSelectedFilters(emptyFilters);
    setSortBy("Newest Arrivals");
    setOpenFilter(null);
  };

  return (
    <main className="bg-white">
      <Filters
        activeTags={activeTags}
        selectedFilters={selectedFilters}
        filterOptions={filterOptions}
        sortBy={sortBy}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        onToggleOption={toggleOption}
        onRemoveTag={removeTag}
        onClearAll={clearAll}
        onSortChange={setSortBy}
      />

      <section id="products" className="section-container py-8 sm:py-12">
        {searchQuery ? (
          <p className="max-w-7xl mx-auto mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            Results for &ldquo;{searchQuery}&rdquo;
          </p>
        ) : null}

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
          {pageProducts.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
              />
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="max-w-7xl mx-auto py-16 text-center text-black/40 text-[10px] font-bold tracking-[0.2em] uppercase">
            No products found
          </div>
        )}

        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </main>
  );
}
