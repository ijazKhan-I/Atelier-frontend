import type { Product } from '@/type/shopType'
import React from "react";

type ProductGridProps = {
  data: Product[];
};

function Filter({ data }: ProductGridProps) {

    function buildFilterOptions(products: Product[]) {
  const categories = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();

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
    Category: [...categories].sort(),
    Color: [...colors].sort(),
    Size: [...sizes].sort(),
  };
}
const filters = buildFilterOptions(data);
  return (
    <div >
      {filters.Category}
      {filters.Size}
    </div>
  );
}

export default Filter;

